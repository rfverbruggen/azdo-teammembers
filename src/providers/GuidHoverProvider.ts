import * as vscode from "vscode";
import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";

export class GuidHoverProvider implements vscode.HoverProvider {
  constructor(private readonly _teamMemberFactory: ITeamMemberFactory) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ) {
    const regex = new RegExp(/@<(?<guid>[a-zA-Z0-9-]+)>/g);

    const range = document.getWordRangeAtPosition(position, regex);
    const mention = document.getText(range);

    let matches = regex.exec(mention);

    let guid = matches?.groups?.guid;

    if (guid) {
      // Find the name based on the guid
      const teamMembers = await this._teamMemberFactory.GetTeamMembers();

      let name = teamMembers.find(
        (member) => member.guid.toUpperCase() === guid.toUpperCase()
      )?.name;

      if (name) {
        return new vscode.Hover({ language: "azdo-teammember", value: name });
      }
    }
  }
}
