import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";

export default class TeamMemberFactory implements ITeamMemberFactory {
  private readonly _teamMemberRepositories: ITeamMemberRepository[] = [];

  AddTeamMemberRepository(teamMemberRepository: ITeamMemberRepository): void {
    this._teamMemberRepositories.push(teamMemberRepository);
  }

  async GetTeamMembers(): Promise<TeamMember[]> {
    let teamMembers: TeamMember[] = [];

    this._teamMemberRepositories.forEach(async (teamMemberRepository) => {
      teamMembers = teamMembers.concat(
        await teamMemberRepository.GetTeamMembers()
      );
    });

    return teamMembers;
  }
}
