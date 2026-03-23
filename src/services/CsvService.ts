import * as Papa from "papaparse";

export interface ICsvRow {
  [key: string]: string;
}

export interface IGroupedData {
  fmno: string;
  rows: ICsvRow[];
}

export class CsvService {
  /**
   * Parse a CSV string into an array of row objects.
   * Uses PapaParse with header mode so each row is a key-value object.
   */
  public parseCsv(csvContent: string): ICsvRow[] {
    const result = Papa.parse<ICsvRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (result.errors.length > 0) {
      const criticalErrors = result.errors.filter(
        (e) => e.type !== "FieldMismatch"
      );
      if (criticalErrors.length > 0) {
        throw new Error(
          `CSV parsing failed: ${criticalErrors
            .map((e) => `Row ${e.row}: ${e.message}`)
            .join("; ")}`
        );
      }
    }

    return result.data;
  }

  /**
   * Group parsed CSV rows by the "Reader FMNO" column.
   * Returns one IGroupedData entry per unique FMNO.
   */
  public groupByFmno(rows: ICsvRow[]): IGroupedData[] {
    const fmnoColumn = "Reader FMNO";
    const groups = new Map<string, ICsvRow[]>();

    for (const row of rows) {
      const fmno = (row[fmnoColumn] || "").trim();
      if (!fmno) continue;

      if (!groups.has(fmno)) {
        groups.set(fmno, []);
      }
      groups.get(fmno)!.push(row);
    }

    const result: IGroupedData[] = [];
    groups.forEach((groupRows, fmno) => {
      result.push({ fmno, rows: groupRows });
    });

    return result;
  }

  /**
   * Convert rows back into a CSV string (with headers).
   */
  public toCsvString(rows: ICsvRow[]): string {
    if (rows.length === 0) return "";
    return Papa.unparse(rows);
  }
}
