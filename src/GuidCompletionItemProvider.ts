import * as vscode from 'vscode';
import { TeamMember } from "./models/TeamMember";

export class GuidCompletionItemProvider implements vscode.CompletionItemProvider
{
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
	{
		let items: vscode.CompletionItem[] = [];

		let teamMembers: TeamMember[] = vscode.workspace.getConfiguration("azdo-teammembers").get("teammembers", []);

		teamMembers.forEach(member =>
		{
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
