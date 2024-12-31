import { ITeamMemberFactory } from "../interfaces/ITeamMemberFactory";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";

export default class TeamMemberFactory implements ITeamMemberFactory {
  private _teamMemberRepositories: ITeamMemberRepository[] = [];

  AddTeamMemberRepository(teamMemberRepository: ITeamMemberRepository): void {
    this._teamMemberRepositories.push(teamMemberRepository);
  }

  GetTeamMembers(): TeamMember[] {
    let teamMembers: TeamMember[] = [];

    this._teamMemberRepositories.forEach((teamMemberRepository) => {
      teamMembers = teamMembers.concat(teamMemberRepository.GetTeamMembers());
    });

    return teamMembers;
  }
}
