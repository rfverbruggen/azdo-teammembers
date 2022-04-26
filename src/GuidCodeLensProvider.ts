import * as vscode from 'vscode';
import { TeamMember } from "./models/TeamMember";

export class GuidCodeLensProvider implements vscode.CodeLensProvider
{
	private codeLenses: vscode.CodeLens[] = [];
	private regex: RegExp;
	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

	constructor()
	{
		this.regex = /@<([a-zA-Z0-9\-]+)>/g;

		vscode.workspace.onDidChangeConfiguration((_) =>
		{
			this._onDidChangeCodeLenses.fire();
		});
	}

	public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]>
	{
		this.codeLenses = [];
		const regex = new RegExp(this.regex);
		const text = document.getText();
		let matches;

		while ((matches = regex.exec(text)) !== null)
		{
			const line = document.lineAt(document.positionAt(matches.index).line);
			const indexOf = line.text.indexOf(matches[0]);
			const position = new vscode.Position(line.lineNumber, indexOf);
			const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));

			if (range)
			{
				let teamMembers: TeamMember[] = vscode.workspace.getConfiguration("azdo-teammembers").get("teammembers", []);

				let guid = matches[1];
				let name = teamMembers.find(member => member.guid === guid)?.name;
				let command: vscode.Command = {
					title: name ?? "",
					tooltip: name,
					command: "",
					arguments: []
				};

				this.codeLenses.push(new vscode.CodeLens(range, command));
			}
		};

		return this.codeLenses;
	}
}
