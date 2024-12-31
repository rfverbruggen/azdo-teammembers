import * as vscode from "vscode";
import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";

export class GuidHoverProvider implements vscode.HoverProvider {
  constructor(private readonly _teamMemberFactory: ITeamMemberFactory) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const regex = new RegExp(/@<(?<guid>[a-zA-Z0-9-]+)>/g);

    const range = document.getWordRangeAtPosition(position, regex);
    const mention = document.getText(range);

    let matches = regex.exec(mention);

    let guid = matches?.groups?.guid;

    if (guid) {
      // Find the name based on the guid
      let name = this._teamMemberFactory
        .GetTeamMembers()
        .find(
          (member) => member.guid.toUpperCase() === guid.toUpperCase()
        )?.name;

      if (name) {
        return new vscode.Hover({ language: "azdo-teammember", value: name });
      }
    }
  }
}
