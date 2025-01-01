import * as vscode from "vscode";
import { Azdo } from "./azdo";
import { SETTINGS_ORGURL, SETTINGS_SECTION } from "../constants";
import { ICredentialStore } from "../interfaces/ICredentialStore";

export class CredentialStore implements ICredentialStore, vscode.Disposable {
  private readonly _disposables: vscode.Disposable[];
  private _azdoAPI: Azdo | undefined;
  private _orgUrl: string | undefined;
  private readonly _sessionOptions: vscode.AuthenticationGetSessionOptions = {
    createIfNone: true,
  };

  constructor() {
    this._disposables = [];
    this._disposables.push(
      vscode.authentication.onDidChangeSessions(async () => {
        if (!this.IsAuthenticated()) {
          return await this.Initialize();
        }
      })
    );
  }

  public async Initialize(): Promise<void> {
    this._azdoAPI = await this.Login();
  }

  public IsAuthenticated(): boolean {
    return !!this._azdoAPI;
  }

  public GetHub(): Azdo | undefined {
    return this._azdoAPI;
  }

  public async Login(): Promise<Azdo | undefined> {
    this._orgUrl = vscode.workspace
      .getConfiguration(SETTINGS_SECTION)
      .get<string | undefined>(SETTINGS_ORGURL);

    if (!this._orgUrl) {
      return undefined;
    }

    let retry: boolean = true;

    while (retry) {
      try {
        const session = await this.getSession(this._sessionOptions);

        if (!session) {
          return undefined;
        }

        const token = await this.getToken(session);

        if (!token) {
          return undefined;
        }

        const azdo = new Azdo(this._orgUrl, token);
        azdo.authenticatedUser = (
          await azdo.connection.connect()
        ).authenticatedUser;

        return azdo;
      } catch (e) {
        if (
          e instanceof Error &&
          e.message === "User canceled authentication"
        ) {
          return undefined;
        }
      }

      retry =
        (await vscode.window.showErrorMessage(
          "Error signing in to Azure DevOps",
          "Try again?",
          "Cancel"
        )) === "Try again?";
      if (retry) {
        this._sessionOptions.forceNewSession = true;
        this._sessionOptions.createIfNone = false;
        this._sessionOptions.clearSessionPreference = true;
      }
    }
  }

  private async getSession(
    sessionOptions: vscode.AuthenticationGetSessionOptions
  ): Promise<vscode.AuthenticationSession | undefined> {
    return await vscode.authentication.getSession(
      // Specifies the Microsoft Auth Provider
      "microsoft",
      // This GUID is the Azure DevOps GUID and you basically ask for a token that can be used to interact with AzDO. This is publicly documented all over
      ["499b84ac-1321-427f-aa17-267ca6975798/.default", "offline_access"],
      sessionOptions
    );
  }

  private async getToken(
    session: vscode.AuthenticationSession
  ): Promise<string | undefined> {
    return session?.accessToken;
  }

  dispose() {
    this._disposables.forEach((disposable) => disposable.dispose());
  }
}
