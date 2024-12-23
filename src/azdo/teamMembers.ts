import * as vscode from "vscode";
import { Azdo } from "./azdo";
import { ICoreApi } from "azure-devops-node-api/CoreApi";
import { TeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { CredentialStore } from "./credentials";

export class AzdoTeamMembers implements vscode.Disposable {
  private _disposables: vscode.Disposable[] = [];
  private _hub: Azdo | undefined;
  private _coreApi?: ICoreApi;

  constructor(private readonly _credentialStore: CredentialStore) {
    this._disposables = [];
  }

  async ensure(): Promise<AzdoTeamMembers> {
    if (!this._credentialStore.isAuthenticated()) {
      await this._credentialStore.initialize();
    }

    this._hub = this._credentialStore.getHub();
    this._coreApi = await this._hub?.connection.getCoreApi();

    return this;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    let teamMembers: TeamMember[] = [];

    await this._coreApi?.getProjects().then(async (projects) => {
      await Promise.all(
        projects.map(async (project) => {
          await this._coreApi?.getTeams(project.id!).then(async (teams) => {
            await Promise.all(
              teams.map(async (team) => {
                await this._coreApi
                  ?.getTeamMembersWithExtendedProperties(project.id!, team.id!)
                  .then(async (teamTeamMembers) => {
                    teamMembers.push(...teamTeamMembers);
                  });
              })
            );
          });
        })
      );
    });

    const uniqueTeamMembers = teamMembers.filter(
      (teamMember, i) =>
        teamMembers.findIndex(
          (s) => teamMember.identity?.id === s.identity?.id
        ) === i
    );

    return uniqueTeamMembers;
  }

  dispose() {
    this._disposables.forEach((disposable) => disposable.dispose());
  }
}
