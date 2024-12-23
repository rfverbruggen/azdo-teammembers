import { TeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import * as vscode from "vscode";

export class GuidCompletionItemProvider
  implements vscode.CompletionItemProvider
{
  constructor(private readonly _teamMembers: TeamMember[]) {}

  public provideCompletionItems(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ) {
    let items: vscode.CompletionItem[] = [];

    this._teamMembers.forEach((member) => {
      const item = new vscode.CompletionItem(
        member.identity?.displayName ?? "Unresolved",
        vscode.CompletionItemKind.Text
      );
      item.insertText = `<${member.identity?.id}>`;
      items.push(item);
    });

    return items;
  }
}
