import { getSP } from "./PnPSetup";
import { IFolderInfo } from "@pnp/sp/folders";

const DATA_LIBRARY = "Data";
const BULK_FOLDER = "Bulk data from PC";
const MANAGER_FOLDER = "Data for each manager";
const LOGS_FOLDER = "Logs";
const ALERTS_FOLDER = "Alerts";

export interface IFileInfo {
  name: string;
  serverRelativeUrl: string;
}

export class SharePointService {
  private get bulkFolderPath(): string {
    return `${DATA_LIBRARY}/${BULK_FOLDER}`;
  }

  private get managerRootPath(): string {
    return `${DATA_LIBRARY}/${MANAGER_FOLDER}`;
  }

  private get logsFolderPath(): string {
    return `${DATA_LIBRARY}/${LOGS_FOLDER}`;
  }

  private get alertsFolderPath(): string {
    return `${DATA_LIBRARY}/${ALERTS_FOLDER}`;
  }

  /**
   * List all CSV files in the "Data/Bulk data from PC" folder.
   */
  public async listBulkCsvFiles(): Promise<IFileInfo[]> {
    const sp = getSP();
    const files = await sp.web
      .getFolderByServerRelativePath(this.bulkFolderPath)
      .files();

    return files
      .filter((f) => f.Name.toLowerCase().endsWith(".csv"))
      .map((f) => ({
        name: f.Name,
        serverRelativeUrl: f.ServerRelativeUrl,
      }));
  }

  /**
   * Download and return the text content of a file.
   */
  public async getFileContent(serverRelativeUrl: string): Promise<string> {
    const sp = getSP();
    const blob: Blob = await sp.web
      .getFileByServerRelativePath(serverRelativeUrl)
      .getBlob();
    return blob.text();
  }

  /**
   * Ensure the manager root folder ("Data/Data for each manager") exists.
   */
  public async ensureManagerRootFolder(): Promise<void> {
    const sp = getSP();
    await sp.web.folders.addUsingPath(this.managerRootPath, true);
  }

  /**
   * Delete a file by its server-relative URL.
   */
  public async deleteFile(serverRelativeUrl: string): Promise<void> {
    const sp = getSP();
    await sp.web
      .getFileByServerRelativePath(serverRelativeUrl)
      .delete();
  }

  /**
   * Save a processing log to Data/Logs as a timestamped text file.
   */
  public async saveLog(logContent: string): Promise<string> {
    const sp = getSP();
    await sp.web.folders.addUsingPath(this.logsFolderPath, true);

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `import_${timestamp}.txt`;

    const blob = new Blob([logContent], { type: "text/plain" });
    const buffer = await blob.arrayBuffer();

    await sp.web
      .getFolderByServerRelativePath(this.logsFolderPath)
      .files.addUsingPath(fileName, buffer, { Overwrite: true });

    return fileName;
  }

  /**
   * Save an alert report to Data/Alerts for unauthorized row access.
   */
  public async saveAlert(
    fmno: string,
    alertContent: string
  ): Promise<string> {
    const sp = getSP();
    await sp.web.folders.addUsingPath(this.alertsFolderPath, true);

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replace(/:/g, "-");
    const fileName = `${fmno}_${date}_${time}.txt`;

    const blob = new Blob([alertContent], { type: "text/plain" });
    const buffer = await blob.arrayBuffer();

    await sp.web
      .getFolderByServerRelativePath(this.alertsFolderPath)
      .files.addUsingPath(fileName, buffer, { Overwrite: true });

    return fileName;
  }

  /**
   * Ensure a folder exists for a specific manager FMNO under the manager root.
   * If it already exists, delete all files inside it.
   * Returns the server-relative path of the folder.
   */
  public async ensureManagerFolder(fmno: string): Promise<string> {
    const sp = getSP();
    const folderPath = `${this.managerRootPath}/${fmno}`;

    let folderExists = false;
    try {
      const folderInfo: IFolderInfo = await sp.web
        .getFolderByServerRelativePath(folderPath)
        .select("Exists")();
      folderExists = folderInfo.Exists;
    } catch {
      folderExists = false;
    }

    if (folderExists) {
      await this.clearFolderContents(folderPath);
    } else {
      await sp.web.folders.addUsingPath(folderPath, true);
    }

    return folderPath;
  }

  /**
   * Delete all files inside a folder (but not subfolders).
   */
  private async clearFolderContents(folderPath: string): Promise<void> {
    const sp = getSP();
    const files = await sp.web
      .getFolderByServerRelativePath(folderPath)
      .files();

    for (const file of files) {
      await sp.web
        .getFileByServerRelativePath(file.ServerRelativeUrl)
        .delete();
    }
  }

  /**
   * Break role inheritance on a folder and grant access only to site owners
   * and the specified user (by loginName / userPrincipalName).
   */
  public async setFolderPermissions(
    folderPath: string,
    userPrincipalName: string
  ): Promise<void> {
    const sp = getSP();

    const folderItem = await sp.web
      .getFolderByServerRelativePath(folderPath)
      .getItem();

    // Break inheritance, removing all existing permissions (don't copy from parent)
    await folderItem.breakRoleInheritance(false, true);

    // Get the "Read" role definition (standard SharePoint role)
    const readRoleDef = await sp.web.roleDefinitions.getByName("Read")();

    // Resolve the target user
    const user = await sp.web.siteUsers.getByEmail(userPrincipalName)();

    // Grant Read to the specific manager
    await folderItem.roleAssignments.add(user.Id, readRoleDef.Id);

    // Ensure site owners group retains Full Control
    const ownerGroup = await sp.web.associatedOwnerGroup();
    const fullControlDef = await sp.web.roleDefinitions.getByName(
      "Full Control"
    )();
    await folderItem.roleAssignments.add(ownerGroup.Id, fullControlDef.Id);
  }

  /**
   * Upload a CSV string as a file to the specified folder.
   */
  public async uploadFile(
    folderPath: string,
    fileName: string,
    content: string
  ): Promise<void> {
    const sp = getSP();
    const blob = new Blob([content], { type: "text/csv" });
    const buffer = await blob.arrayBuffer();

    await sp.web
      .getFolderByServerRelativePath(folderPath)
      .files.addUsingPath(fileName, buffer, { Overwrite: true });
  }

  // --- DataViewer methods ---

  /**
   * Get the folder path for a specific FMNO under the manager root.
   */
  public getManagerFolderPath(fmno: string): string {
    return `${this.managerRootPath}/${fmno}`;
  }

  /**
   * List files in a specific manager's folder.
   */
  public async listManagerFiles(fmno: string): Promise<IFileInfo[]> {
    const sp = getSP();
    const folderPath = this.getManagerFolderPath(fmno);

    try {
      const files = await sp.web
        .getFolderByServerRelativePath(folderPath)
        .files();

      return files.map((f) => ({
        name: f.Name,
        serverRelativeUrl: f.ServerRelativeUrl,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Read and return the content of a CSV file in a manager's folder.
   */
  public async getManagerFileContent(
    serverRelativeUrl: string
  ): Promise<string> {
    return this.getFileContent(serverRelativeUrl);
  }
}
