import * as azdev from "azure-devops-node-api";

export interface IAzDOHub {
  connection: azdev.WebApi;
  GetNewWebApiClient(orgUrl: string): azdev.WebApi;
}
