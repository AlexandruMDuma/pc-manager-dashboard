declare interface IDataViewerWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'DataViewerWebPartStrings' {
  const strings: IDataViewerWebPartStrings;
  export = strings;
}
