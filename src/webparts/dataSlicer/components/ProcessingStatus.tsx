import * as React from "react";
import styles from "./DataSlicer.module.scss";

export type LogLevel = "info" | "success" | "error" | "warning";

export interface ILogEntry {
  timestamp: Date;
  message: string;
  level: LogLevel;
}

export interface IProcessingSummary {
  totalFiles: number;
  totalRows: number;
  uniqueFmnos: number;
  foldersCreated: number;
  errors: number;
}

export interface IProcessingStatusProps {
  logs: ILogEntry[];
  summary: IProcessingSummary | null;
  isProcessing: boolean;
}

const ProcessingStatus: React.FC<IProcessingStatusProps> = ({
  logs,
  summary,
  isProcessing,
}) => {
  const logEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0 && !summary) {
    return null;
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className={styles.statusSection}>
      {summary && !isProcessing && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Processing Complete</div>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryValue}>{summary.totalFiles}</div>
              <div className={styles.summaryLabel}>Files Processed</div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryValue}>{summary.totalRows}</div>
              <div className={styles.summaryLabel}>Total Rows</div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryValue}>{summary.uniqueFmnos}</div>
              <div className={styles.summaryLabel}>Unique Managers</div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryValue}>
                {summary.foldersCreated}
              </div>
              <div className={styles.summaryLabel}>Folders Created</div>
            </div>
            {summary.errors > 0 && (
              <div className={styles.summaryItem}>
                <div
                  className={`${styles.summaryValue} ${styles.summaryValueError}`}
                >
                  {summary.errors}
                </div>
                <div className={styles.summaryLabel}>Errors</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.logContainer}>
        {logs.map((entry, index) => (
          <div
            key={index}
            className={`${styles.logEntry} ${
              entry.level === "success"
                ? styles.success
                : entry.level === "error"
                ? styles.error
                : entry.level === "warning"
                ? styles.warning
                : styles.info
            }`}
          >
            [{formatTime(entry.timestamp)}] {entry.message}
          </div>
        ))}
        {isProcessing && (
          <div className={`${styles.logEntry} ${styles.info}`}>
            Processing...
          </div>
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default ProcessingStatus;
