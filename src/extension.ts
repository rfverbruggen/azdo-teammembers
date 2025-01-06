import * as vscode from "vscode";
import {
  GuidCompletionItemProvider,
  GuidCodeLensProvider,
  GuidHoverProvider,
} from "./providers";
import ConfigurationTeamMemberRepository from "./repositories/ConfigurationTeamMemberRepository";
import TeamMemberFactory from "./factories/TeamMemberFactory";
import { CredentialStore } from "./azdo/CredentialStore";
import {
  SETTINGS_SECTION,
  SETTINGS_ORGURL,
  EXTENSTION_ID,
  CACHE_KEY,
} from "./constants";
import AzDOTeamMemberRepository from "./repositories/AzDOTeamMemberRepository";
import CachedRepository from "./repositories/CachedRepository";
import Cache from "./cache/Cache";

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
    await credentialStore.Initialize();

    const azdoTeamMemberRepository = new AzDOTeamMemberRepository(
      credentialStore
    );

    await azdoTeamMemberRepository.Ensure();

    const cache = new Cache(context, EXTENSTION_ID);

    const cachedAzDOTeamMemberRepository = new CachedRepository(
      cache,
      azdoTeamMemberRepository,
      CACHE_KEY,
      86400 // Cache the team members for 24 hours
    );

    teamMemberFactory.AddTeamMemberRepository(cachedAzDOTeamMemberRepository);
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
