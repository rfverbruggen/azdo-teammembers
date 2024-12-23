import * as azdev from "azure-devops-node-api";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { Identity } from "azure-devops-node-api/interfaces/IdentitiesInterfaces";

export class Azdo {
  private _authHandler: IRequestHandler;
  public connection: azdev.WebApi;
  public authenticatedUser: Identity | undefined;

  constructor(public orgUrl: string, token: string) {
    this._authHandler = azdev.getBearerHandler(token, true);
    this.connection = this.getNewWebApiClient(orgUrl);
  }

  public getNewWebApiClient(orgUrl: string): azdev.WebApi {
    return new azdev.WebApi(orgUrl, this._authHandler);
  }
}
