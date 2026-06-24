import { ICachedRepository } from "../interfaces/ICachedRepository";
import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";

export default class TeamMemberFactory implements ITeamMemberFactory {
  private readonly _teamMemberRepositories: Array<
    ITeamMemberRepository | ICachedRepository
  > = [];

  AddTeamMemberRepository(teamMemberRepository: ITeamMemberRepository): void {
    this._teamMemberRepositories.push(teamMemberRepository);
  }

  async GetTeamMembers(): Promise<TeamMember[]> {
    let teamMembers: TeamMember[] = [];

    for (const teamMemberRepository of this._teamMemberRepositories) {
      teamMembers = teamMembers.concat(
        await teamMemberRepository.GetTeamMembers()
      );
    }

    const uniqueTeamMembers = teamMembers.filter(
      (teamMember, i) =>
        teamMembers.findIndex((s) => teamMember.guid === s.guid) === i
    );

    return uniqueTeamMembers;
  }

  async RefreshCache(): Promise<void> {
    for (const teamMemberRepository of this._teamMemberRepositories) {
      if ("RefreshCache" in teamMemberRepository) {
        await teamMemberRepository.RefreshCache();
      }
    }
  }
}
