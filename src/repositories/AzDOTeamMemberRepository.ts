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

    const projectIds = await this.GetProjectIds();

    projectIds.map(async (projectId) => {
      const teamIds = await this.GetTeamIdsPerProjectId(projectId);

      teamIds.map(async (teamId) => {
        const teamMembersPerTeam =
          await this.GetTeamMembersPerProjectIdAndTeamId(projectId, teamId);

        teamMembers.push(...teamMembersPerTeam);
      });
    });

    const uniqueTeamMembers = teamMembers.filter(
      (teamMember, i) =>
        teamMembers.findIndex((s) => teamMember.guid === s.guid) === i
    );

    return uniqueTeamMembers;
  }

  private async GetProjectIds(): Promise<string[]> {
    let projectIds: string[] = [];

    await this._coreApi?.getProjects().then((projects) => {
      projectIds = projects.map((project) => project.id!);
    });

    return projectIds;
  }

  private async GetTeamIdsPerProjectId(projectId: string): Promise<string[]> {
    let teamIds: string[] = [];

    await this._coreApi?.getTeams(projectId).then((teams) => {
      teamIds = teams.map((team) => team.id!);
    });

    return teamIds;
  }

  private async GetTeamMembersPerProjectIdAndTeamId(
    projectId: string,
    teamId: string
  ): Promise<TeamMember[]> {
    let teamMembers: TeamMember[] = [];

    await this._coreApi
      ?.getTeamMembersWithExtendedProperties(projectId, teamId)
      .then(async (teamTeamMembers) => {
        teamMembers.push(
          ...teamTeamMembers.map((member) =>
            TeamMemberConverter.ConvertToTeamMember(member)
          )
        );
      });

    return teamMembers;
  }
}
