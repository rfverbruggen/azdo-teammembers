import * as vscode from "vscode";
import {
  GuidCompletionItemProvider,
  GuidCodeLensProvider,
  GuidHoverProvider,
} from "./providers";
import ConfigurationTeamMemberRepository from "./repositories/ConfigurationTeamMemberRepository";

let disposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext) {
  const teamMemberRepository = new ConfigurationTeamMemberRepository();
  const teammembers = teamMemberRepository.GetTeamMembers();

  const registeredCompletionItemProvider =
    vscode.languages.registerCompletionItemProvider(
      "markdown",
      new GuidCompletionItemProvider(teammembers),
      "@"
    );

  const registeredCodeLensProvider = vscode.languages.registerCodeLensProvider(
    "markdown",
    new GuidCodeLensProvider(teammembers)
  );

  const registeredHoverProvider = vscode.languages.registerHoverProvider(
    "markdown",
    new GuidHoverProvider(teammembers)
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
