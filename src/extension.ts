import * as vscode from "vscode";
import {
  GuidCompletionItemProvider,
  GuidCodeLensProvider,
  GuidHoverProvider,
} from "./providers";
import { CredentialStore } from "./azdo/credentials";
import { AzdoTeamMembers } from "./azdo/teamMembers";
import { TeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { TeamMember as TeamMemberFromSettings } from "./models/TeamMember";
import {
  ORGURL_SETTINGS,
  SETTINGS_NAMESPACE,
  TEAMMEMBERS_SETTINGS,
} from "./constants";

let disposables: vscode.Disposable[] = [];

export async function activate(context: vscode.ExtensionContext) {
  let teamMembers: TeamMember[] = [];

  const orgUrl = vscode.workspace
    .getConfiguration(SETTINGS_NAMESPACE)
    .get<string | undefined>(ORGURL_SETTINGS);

  if (orgUrl) {
    const credentialStore = new CredentialStore();
    context.subscriptions.push(credentialStore);
    await credentialStore.initialize();

    const azdoTeamMembers = new AzdoTeamMembers(credentialStore);
    await azdoTeamMembers.ensure();

    teamMembers.push(...(await azdoTeamMembers.getTeamMembers()));
  }

  const teamMembersFromSettings: TeamMemberFromSettings[] = vscode.workspace
    .getConfiguration(SETTINGS_NAMESPACE)
    .get(TEAMMEMBERS_SETTINGS, []);

  teamMembersFromSettings.forEach((member) => {
    teamMembers.push({
      identity: {
        id: member.guid,
        displayName: member.name,
      },
    });
  });

  const registeredCompletionItemProvider =
    vscode.languages.registerCompletionItemProvider(
      "markdown",
      new GuidCompletionItemProvider(teamMembers),
      ...["@"]
    );

  const registeredCodeLensProvider = vscode.languages.registerCodeLensProvider(
    "markdown",
    new GuidCodeLensProvider(teamMembers)
  );

  const registeredHoverProvider = vscode.languages.registerHoverProvider(
    "markdown",
    new GuidHoverProvider(teamMembers)
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
