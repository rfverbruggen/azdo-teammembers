import * as vscode from "vscode";
import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";

export class GuidCompletionItemProvider
  implements vscode.CompletionItemProvider
{
  constructor(private readonly _teamMemberFactory: ITeamMemberFactory) {}

  public provideCompletionItems(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    let items: vscode.CompletionItem[] = [];

    this._teamMemberFactory.GetTeamMembers().forEach((member) => {
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
