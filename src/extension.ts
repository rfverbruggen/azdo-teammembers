import * as vscode from "vscode";
import {
  GuidCompletionItemProvider,
  GuidCodeLensProvider,
  GuidHoverProvider,
} from "./providers";
import ConfigurationTeamMemberRepository from "./repositories/ConfigurationTeamMemberRepository";
import TeamMemberFactory from "./factories/TeamMemberFactory";

let disposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext) {
  const teamMemberFactory = new TeamMemberFactory();
  teamMemberFactory.AddTeamMemberRepository(
    new ConfigurationTeamMemberRepository()
  );

  const registeredCompletionItemProvider =
    vscode.languages.registerCompletionItemProvider(
      "markdown",
      new GuidCompletionItemProvider(teamMemberFactory),
      "@"
    );

  const registeredCodeLensProvider = vscode.languages.registerCodeLensProvider(
    "markdown",
    new GuidCodeLensProvider(teamMemberFactory)
  );

  const registeredHoverProvider = vscode.languages.registerHoverProvider(
    "markdown",
    new GuidHoverProvider(teamMemberFactory)
  );

  context.subscriptions.push(registeredCompletionItemProvider);
  context.subscriptions.push(registeredCodeLensProvider);
  context.subscriptions.push(registeredHoverProvider);
}

export function deactivate() {
  if (disposables) {
    disposables.forEach((item) => item.dispose());
  }
  disposables = [];
}
