import * as vscode from "vscode";
import { TeamMember } from "../models/TeamMember";

export class GuidHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const regex = new RegExp(/@<(?<guid>[a-zA-Z0-9\-]+)>/g);

        const range = document.getWordRangeAtPosition(position, regex);
        const mention = document.getText(range);

        let matches = regex.exec(mention);

        let guid = matches?.groups?.guid;

        if (guid) {
            let teamMembers: TeamMember[] = vscode.workspace.getConfiguration("azdo-teammembers").get("teammembers", []);

            // Find the name based on the guid
            let name = teamMembers.find(member => member.guid.toUpperCase() === guid!.toUpperCase())?.name;

            if (name) {
                return new vscode.Hover({ language: "azdo-teammember", value: name });
            }
        }

    }
}