import * as vscode from "vscode";
import {
  GuidCompletionItemProvider,
  GuidCodeLensProvider,
  GuidHoverProvider,
} from "./providers";
import ConfigurationTeamMemberRepository from "./repositories/ConfigurationTeamMemberRepository";
import TeamMemberFactory from "./factories/TeamMemberFactory";
import { CredentialStore } from "./azdo/credentials";
import { AzdoTeamMembers } from "./azdo/teamMembers";
import { SETTINGS_ORGURL, SETTINGS_SECTION } from "./constants";

let disposables: vscode.Disposable[] = [];

export async function activate(context: vscode.ExtensionContext) {
  const teamMemberFactory = new TeamMemberFactory();
  teamMemberFactory.AddTeamMemberRepository(
    new ConfigurationTeamMemberRepository()
  );

  const orgUrl = vscode.workspace
    .getConfiguration(SETTINGS_SECTION)
    .get<string | undefined>(SETTINGS_ORGURL);

  if (orgUrl) {
    const credentialStore = new CredentialStore();
    context.subscriptions.push(credentialStore);
    await credentialStore.initialize();

    const azdoTeamMembers = new AzdoTeamMembers(credentialStore);
    await azdoTeamMembers.ensure();

    // teamMemberFactory.AddTeamMemberRepository(azdoTeamMembers);
  }

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
