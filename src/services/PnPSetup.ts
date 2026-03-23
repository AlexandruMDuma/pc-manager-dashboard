import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/files/folder";
import "@pnp/sp/security";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import "@pnp/graph/users";

let _sp: SPFI | undefined;
let _graph: GraphFI | undefined;

export function initPnP(context: WebPartContext): void {
  _sp = spfi().using(spSPFx(context));
  _graph = graphfi().using(graphSPFx(context));
}

export function getSP(): SPFI {
  if (!_sp) {
    throw new Error("PnP SP not initialized. Call initPnP(context) first.");
  }
  return _sp;
}

export function getGraph(): GraphFI {
  if (!_graph) {
    throw new Error("PnP Graph not initialized. Call initPnP(context) first.");
  }
  return _graph;
}
