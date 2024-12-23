import * as vscode from "vscode";
import { TeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

export class GuidHoverProvider implements vscode.HoverProvider {
  constructor(private readonly _teamMembers: TeamMember[]) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ) {
    const regex = new RegExp(/@<(?<guid>[a-zA-Z0-9\-]+)>/g);

    const range = document.getWordRangeAtPosition(position, regex);
    const mention = document.getText(range);

    let matches = regex.exec(mention);

    let guid = matches?.groups?.guid;

    if (guid) {
      // Find the team member based on the guid
      let name = this._teamMembers.find(
        (member) => member.identity?.id?.toUpperCase() === guid!.toUpperCase()
      )?.identity?.displayName;

      if (name) {
        return new vscode.Hover({ language: "azdo-teammember", value: name });
      }
    }
  }
}
