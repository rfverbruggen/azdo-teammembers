import * as vscode from "vscode";
import { TeamMember } from "../models/TeamMember";

export class GuidCompletionItemProvider
  implements vscode.CompletionItemProvider
{
  constructor(private _teamMembers: TeamMember[]) {}

  public provideCompletionItems(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    let items: vscode.CompletionItem[] = [];

    this._teamMembers.forEach((member) => {
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
