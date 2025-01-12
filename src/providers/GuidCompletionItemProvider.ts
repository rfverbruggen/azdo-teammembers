import * as vscode from "vscode";
import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";

export class GuidCompletionItemProvider
  implements vscode.CompletionItemProvider
{
  constructor(private readonly _teamMemberFactory: ITeamMemberFactory) {}

  public async provideCompletionItems(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ) {
    let items: vscode.CompletionItem[] = [];

    const teamMembers = await this._teamMemberFactory.GetTeamMembers();

    teamMembers.forEach((member) => {
      const item = new vscode.CompletionItem(
        member.name,
        vscode.CompletionItemKind.Text
      );
      item.insertText = `<${member.guid}>`;
      items.push(item);
    });

    return items;
  }
}
