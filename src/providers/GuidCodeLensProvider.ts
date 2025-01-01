import * as vscode from "vscode";
import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";

export class GuidCodeLensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private readonly regex: RegExp;
  private readonly _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  constructor(private readonly _teamMemberFactory: ITeamMemberFactory) {
    this.regex = /@<([a-zA-Z0-9-]+)>/g;

    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public async provideCodeLenses(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ) {
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    let matches;

    while ((matches = regex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[0]);
      const position = new vscode.Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(
        position,
        new RegExp(this.regex)
      );

      if (range) {
        let guid = matches[1];

        // Find the name based on the guid in the same casing.
        const teamMembers = await this._teamMemberFactory.GetTeamMembers();

        let name = teamMembers.find(
          (member) => member.guid.toUpperCase() === guid.toUpperCase()
        )?.name;

        // Only insert a code lense if a name is found.
        if (name !== undefined) {
          let command: vscode.Command = {
            title: name,
            tooltip: name,
            command: "",
            arguments: [],
          };

          this.codeLenses.push(new vscode.CodeLens(range, command));
        }
      }
    }

    return this.codeLenses;
  }
}
