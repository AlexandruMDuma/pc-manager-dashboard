import { getGraph } from "./PnPSetup";

export interface IResolvedUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  employeeId: string;
}

export class UserLookupService {
  /**
   * Look up a user by their employeeId (FMNO) via Microsoft Graph.
   * Requires User.Read.All permission.
   */
  public async getUserByEmployeeId(
    employeeId: string
  ): Promise<IResolvedUser | null> {
    try {
      const graph = getGraph();
      const result = await graph.users
        .filter(`employeeId eq '${employeeId}'`)
        .select("id", "displayName", "userPrincipalName", "employeeId")();

      if (result.length === 0) {
        return null;
      }

      const user = result[0];
      return {
        id: user.id ?? "",
        displayName: user.displayName ?? "",
        userPrincipalName: user.userPrincipalName ?? "",
        employeeId: user.employeeId ?? employeeId,
      };
    } catch (error) {
      console.error(
        `Failed to look up user with employeeId ${employeeId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the current user's employeeId from Microsoft Graph.
   */
  public async getCurrentUserEmployeeId(): Promise<string> {
    try {
      const graph = getGraph();
      const me = await graph.me.select("employeeId")();
      return me.employeeId ?? "";
    } catch (error) {
      console.error("Failed to get current user employeeId:", error);
      throw error;
    }
  }

  /**
   * Get current user's full profile from Graph.
   */
  public async getCurrentUser(): Promise<IResolvedUser> {
    const graph = getGraph();
    const me = await graph.me.select(
      "id",
      "displayName",
      "userPrincipalName",
      "employeeId"
    )();
    return {
      id: me.id ?? "",
      displayName: me.displayName ?? "",
      userPrincipalName: me.userPrincipalName ?? "",
      employeeId: me.employeeId ?? "",
    };
  }
}
