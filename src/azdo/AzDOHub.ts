import * as azdev from "azure-devops-node-api";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { Identity } from "azure-devops-node-api/interfaces/IdentitiesInterfaces";
import { IAzDOHub } from "../interfaces/IAzDOHub";

export class AzDOHub implements IAzDOHub {
  private readonly _authHandler: IRequestHandler;
  public connection: azdev.WebApi;
  public authenticatedUser: Identity | undefined;

  constructor(public orgUrl: string, token: string) {
    this._authHandler = azdev.getBearerHandler(token, true);
    this.connection = this.GetNewWebApiClient(orgUrl);
  }

  public GetNewWebApiClient(orgUrl: string): azdev.WebApi {
    return new azdev.WebApi(orgUrl, this._authHandler);
  }
}
