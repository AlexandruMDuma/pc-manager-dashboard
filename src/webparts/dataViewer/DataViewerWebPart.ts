import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";

import DataViewer from "./components/DataViewer";
import { IDataViewerProps } from "./components/IDataViewerProps";
import { initPnP } from "../../services/PnPSetup";

export interface IDataViewerWebPartProps {
  description: string;
}

export default class DataViewerWebPart extends BaseClientSideWebPart<IDataViewerWebPartProps> {
  protected async onInit(): Promise<void> {
    await super.onInit();
    initPnP(this.context);
  }

  public render(): void {
    const element: React.ReactElement<IDataViewerProps> = React.createElement(
      DataViewer,
      {
        context: this.context,
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Data Viewer Settings" },
          groups: [
            {
              groupName: "Configuration",
              groupFields: [
                PropertyPaneTextField("description", {
                  label: "Description",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
