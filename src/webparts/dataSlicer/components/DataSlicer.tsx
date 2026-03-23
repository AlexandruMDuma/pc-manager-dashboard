import * as React from "react";
import styles from "./DataSlicer.module.scss";
import { IDataSlicerProps } from "./IDataSlicerProps";
import ProcessingStatus, {
  ILogEntry,
  IProcessingSummary,
  LogLevel,
} from "./ProcessingStatus";
import { CsvService } from "../../../services/CsvService";
import { SharePointService } from "../../../services/SharePointService";
import { UserLookupService } from "../../../services/UserLookupService";
import MdsButton from "../../../ui/MdsButton";

const DataSlicer: React.FC<IDataSlicerProps> = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [logs, setLogs] = React.useState<ILogEntry[]>([]);
  const [summary, setSummary] = React.useState<IProcessingSummary | null>(
    null
  );

  const csvService = React.useMemo(() => new CsvService(), []);
  const spService = React.useMemo(() => new SharePointService(), []);
  const userService = React.useMemo(() => new UserLookupService(), []);

  const addLog = React.useCallback(
    (message: string, level: LogLevel = "info"): void => {
      setLogs((prev) => [...prev, { timestamp: new Date(), message, level }]);
    },
    []
  );

  const processFiles = React.useCallback(async (): Promise<void> => {
    setIsProcessing(true);
    setLogs([]);
    setSummary(null);

    const stats: IProcessingSummary = {
      totalFiles: 0,
      totalRows: 0,
      uniqueFmnos: 0,
      foldersCreated: 0,
      errors: 0,
    };

    try {
      addLog("Starting data processing...");

      addLog("Listing CSV files in 'Bulk data from PC' folder...");
      const csvFiles = await spService.listBulkCsvFiles();

      if (csvFiles.length === 0) {
        addLog("No CSV files found to process.", "warning");
        setIsProcessing(false);
        return;
      }

      addLog(`Found ${csvFiles.length} CSV file(s) to process.`);
      stats.totalFiles = csvFiles.length;

      await spService.ensureManagerRootFolder();
      addLog("Ensured 'Data for each manager' folder exists.");

      const allGrouped = new Map<
        string,
        { fmno: string; rows: Array<{ [key: string]: string }> }
      >();

      for (const file of csvFiles) {
        addLog(`Reading file: ${file.name}...`);
        const content = await spService.getFileContent(
          file.serverRelativeUrl
        );
        const rows = csvService.parseCsv(content);
        addLog(
          `Parsed ${rows.length} rows from ${file.name}.`,
          "success"
        );
        stats.totalRows += rows.length;

        const groups = csvService.groupByFmno(rows);
        for (const group of groups) {
          if (allGrouped.has(group.fmno)) {
            allGrouped.get(group.fmno)!.rows.push(...group.rows);
          } else {
            allGrouped.set(group.fmno, {
              fmno: group.fmno,
              rows: [...group.rows],
            });
          }
        }
      }

      const uniqueFmnos = Array.from(allGrouped.values());
      stats.uniqueFmnos = uniqueFmnos.length;
      addLog(
        `Found ${uniqueFmnos.length} unique FMNO(s) across all files.`
      );

      for (const group of uniqueFmnos) {
        addLog(`Processing FMNO: ${group.fmno} (${group.rows.length} rows)...`);

        let userPrincipalName: string;
        let userDisplayName: string;
        try {
          const user = await userService.getUserByEmployeeId(group.fmno);
          if (!user) {
            addLog(
              `Could not find user for FMNO ${group.fmno} in Entra ID. Skipping.`,
              "warning"
            );
            stats.errors++;
            continue;
          }
          userPrincipalName = user.userPrincipalName;
          userDisplayName = user.displayName;
          addLog(
            `Resolved FMNO ${group.fmno} -> ${userDisplayName} (${userPrincipalName})`,
            "success"
          );
        } catch (err) {
          addLog(
            `Error looking up FMNO ${group.fmno}: ${
              err instanceof Error ? err.message : String(err)
            }`,
            "error"
          );
          stats.errors++;
          continue;
        }

        try {
          const folderPath = await spService.ensureManagerFolder(group.fmno);
          addLog(`Folder ready: ${folderPath}`);
          stats.foldersCreated++;

          addLog(`Setting permissions for ${userDisplayName}...`);
          await spService.setFolderPermissions(folderPath, userPrincipalName);
          addLog(
            `Permissions set: only ${userDisplayName} and site owners can access.`,
            "success"
          );

          const csvContent = csvService.toCsvString(group.rows);
          const fileName = `reviews_${group.fmno}.csv`;
          await spService.uploadFile(folderPath, fileName, csvContent);
          addLog(
            `Uploaded ${fileName} (${group.rows.length} rows).`,
            "success"
          );
        } catch (err) {
          addLog(
            `Error processing folder for FMNO ${group.fmno}: ${
              err instanceof Error ? err.message : String(err)
            }`,
            "error"
          );
          stats.errors++;
        }
      }

      addLog("Deleting processed source files...");
      for (const file of csvFiles) {
        try {
          await spService.deleteFile(file.serverRelativeUrl);
          addLog(`Deleted ${file.name}.`, "success");
        } catch (err) {
          addLog(
            `Error deleting ${file.name}: ${
              err instanceof Error ? err.message : String(err)
            }`,
            "warning"
          );
        }
      }

      addLog("Processing complete!", "success");
    } catch (err) {
      addLog(
        `Fatal error: ${
          err instanceof Error ? err.message : String(err)
        }`,
        "error"
      );
      stats.errors++;
    } finally {
      setSummary(stats);
      setIsProcessing(false);
    }
  }, [addLog, csvService, spService, userService]);

  React.useEffect(() => {
    if (summary && logs.length > 0 && !isProcessing) {
      const formatTime = (date: Date): string =>
        date.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

      const logText = logs
        .map((entry) => `[${formatTime(entry.timestamp)}] [${entry.level.toUpperCase()}] ${entry.message}`)
        .join("\n");

      const summaryText = [
        "",
        "=== SUMMARY ===",
        `Files processed: ${summary.totalFiles}`,
        `Total rows: ${summary.totalRows}`,
        `Unique managers: ${summary.uniqueFmnos}`,
        `Folders created: ${summary.foldersCreated}`,
        `Errors: ${summary.errors}`,
      ].join("\n");

      spService
        .saveLog(logText + summaryText)
        .then((fileName) => {
          addLog(`Log saved to Data/Logs/${fileName}`, "info");
        })
        .catch((err) => {
          console.error("Failed to save log:", err);
        });
    }
  }, [summary, isProcessing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.dataSlicer}>
      <div className={styles.header}>
        <span className={styles.title}>Data Slicer</span>
      </div>

      <div className={styles.actionBar}>
        <MdsButton
          variant="primary"
          onClick={processFiles}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process New Files"}
        </MdsButton>
      </div>

      <ProcessingStatus
        logs={logs}
        summary={summary}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default DataSlicer;
