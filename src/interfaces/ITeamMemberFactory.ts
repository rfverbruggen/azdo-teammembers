import { TeamMember } from "../models/TeamMember";
import { ITeamMemberRepository } from "./ITeamMemberRepository";

export interface ITeamMemberFactory {
  AddTeamMemberRepository(teamMemberRepository: ITeamMemberRepository): void;

  GetTeamMembers(): TeamMember[];
}
