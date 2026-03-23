import * as React from "react";
import styles from "./DataViewer.module.scss";
import { IDataViewerProps } from "./IDataViewerProps";
import { CsvService, ICsvRow } from "../../../services/CsvService";
import { SharePointService } from "../../../services/SharePointService";
import { UserLookupService } from "../../../services/UserLookupService";

const IconDocument48: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="48"
    height="48"
    aria-hidden="true"
    focusable="false"
  >
    <g>
      <path d="M7,45a4,4,0,0,1-4-4V25H6" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2" />
      <path d="M11,3V41a4,4,0,0,1-4,4H41a4,4,0,0,0,4-4V3Z" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2" />
      <line x1="18" y1="27" x2="38" y2="27" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2" />
      <line x1="18" y1="35" x2="38" y2="35" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2" />
      <rect x="18" y="11" width="20" height="8" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2" />
    </g>
  </svg>
);

interface IViewerState {
  loading: boolean;
  error: string | null;
  fmno: string | null;
  displayName: string | null;
  rowCount: number;
  rows: ICsvRow[];
}

const DataViewer: React.FC<IDataViewerProps> = () => {
  const [state, setState] = React.useState<IViewerState>({
    loading: true,
    error: null,
    fmno: null,
    displayName: null,
    rowCount: 0,
    rows: [],
  });

  const csvService = React.useMemo(() => new CsvService(), []);
  const spService = React.useMemo(() => new SharePointService(), []);
  const userService = React.useMemo(() => new UserLookupService(), []);

  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const currentUser = await userService.getCurrentUser();

        if (!currentUser.employeeId) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error:
              "Your account does not have an Employee ID (FMNO) configured. Please contact your administrator.",
          }));
          return;
        }

        const fmno = currentUser.employeeId;
        const files = await spService.listManagerFiles(fmno);

        if (files.length === 0) {
          setState({
            loading: false,
            error: null,
            fmno,
            displayName: currentUser.displayName,
            rowCount: 0,
            rows: [],
          });
          return;
        }

        let allRows: ICsvRow[] = [];
        const foreignRows: ICsvRow[] = [];

        for (const file of files) {
          if (file.name.toLowerCase().endsWith(".csv")) {
            const content = await spService.getManagerFileContent(
              file.serverRelativeUrl
            );
            const rows = csvService.parseCsv(content);

            for (const row of rows) {
              const rowFmno = (row["Reader FMNO"] || "").trim();
              if (rowFmno === fmno) {
                allRows.push(row);
              } else {
                foreignRows.push(row);
              }
            }
          }
        }

        if (foreignRows.length > 0) {
          const alertLines = [
            `ALERT: Unauthorized rows detected in folder for FMNO ${fmno}`,
            `User: ${currentUser.displayName} (${currentUser.userPrincipalName})`,
            `Date: ${new Date().toISOString()}`,
            `Rows belonging to this user: ${allRows.length}`,
            `Foreign rows found and skipped: ${foreignRows.length}`,
            "",
            "Foreign row details:",
          ];
          for (const row of foreignRows) {
            alertLines.push(
              `  Reader FMNO: ${row["Reader FMNO"] || "(empty)"} | ${JSON.stringify(row)}`
            );
          }

          spService
            .saveAlert(fmno, alertLines.join("\n"))
            .catch(console.error);
        }

        setState({
          loading: false,
          error: null,
          fmno,
          displayName: currentUser.displayName,
          rowCount: allRows.length,
          rows: allRows,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while loading your data.",
        }));
      }
    };

    loadData().catch(console.error);
  }, [csvService, spService, userService]);

  if (state.loading) {
    return (
      <div className={styles.dataViewer}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading your review data...</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={styles.dataViewer}>
        <div className={styles.errorMessage}>
          <div className={styles.errorTitle}>Unable to load data</div>
          <div>{state.error}</div>
        </div>
      </div>
    );
  }

  if (state.rowCount === 0) {
    return (
      <div className={styles.dataViewer}>
        <div className={styles.header}>
          <div className={styles.title}>
            Welcome, {state.displayName || "Manager"}
          </div>
          <div className={styles.subtitle}>FMNO: {state.fmno}</div>
        </div>
        <div className={styles.noData}>
          <div className={styles.noDataIcon}>
            <IconDocument48 />
          </div>
          <div>No review data is available for you at this time.</div>
          <div>Data will appear here once it has been processed.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dataViewer}>
      <div className={styles.header}>
        <div className={styles.title}>
          Welcome, {state.displayName || "Manager"}
        </div>
        <div className={styles.subtitle}>FMNO: {state.fmno}</div>
      </div>

      <div className={styles.countCard}>
        <div className={styles.countValue}>{state.rowCount}</div>
        <div className={styles.countLabel}>
          {state.rowCount === 1 ? "Review" : "Reviews"}
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
