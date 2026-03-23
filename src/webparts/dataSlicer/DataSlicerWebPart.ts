import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";

import DataSlicer from "./components/DataSlicer";
import { IDataSlicerProps } from "./components/IDataSlicerProps";
import { initPnP } from "../../services/PnPSetup";

export interface IDataSlicerWebPartProps {
  description: string;
}

export default class DataSlicerWebPart extends BaseClientSideWebPart<IDataSlicerWebPartProps> {
  protected async onInit(): Promise<void> {
    await super.onInit();
    initPnP(this.context);
  }

  public render(): void {
    const element: React.ReactElement<IDataSlicerProps> = React.createElement(
      DataSlicer,
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
          header: { description: "Data Slicer Settings" },
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
