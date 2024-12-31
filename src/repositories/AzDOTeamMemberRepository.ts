import { Azdo } from "../azdo/azdo";
import { CredentialStore } from "../azdo/credentials";
import TeamMemberConverter from "../converters/TeamMemberConverter";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";
import { ICoreApi } from "azure-devops-node-api/CoreApi";

export default class AzDOTeamMemberRepository implements ITeamMemberRepository {
  private _hub: Azdo | undefined;
  private _coreApi?: ICoreApi;

  constructor(private readonly _credentialStore: CredentialStore) {}

  async Ensure(): Promise<AzDOTeamMemberRepository> {
    if (!this._credentialStore.isAuthenticated()) {
      await this._credentialStore.initialize();
    }

    this._hub = this._credentialStore.getHub();
    this._coreApi = await this._hub?.connection.getCoreApi();

    return this;
  }

  async GetTeamMembers(): Promise<TeamMember[]> {
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
                    teamMembers.push(
                      ...teamTeamMembers.map((member) =>
                        TeamMemberConverter.ConvertToTeamMember(member)
                      )
                    );
                  });
              })
            );
          });
        })
      );
    });

    const uniqueTeamMembers = teamMembers.filter(
      (teamMember, i) =>
        teamMembers.findIndex((s) => teamMember.guid === s.guid) === i
    );

    return uniqueTeamMembers;
  }
}
