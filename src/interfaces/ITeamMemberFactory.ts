import { TeamMember } from "../models/TeamMember";
import { ITeamMemberRepository } from "./ITeamMemberRepository";

export interface ITeamMemberFactory {
  AddTeamMemberRepository(teamMemberRepository: ITeamMemberRepository): void;

  RefreshCache(): Promise<void> | void;

  GetTeamMembers(): Promise<TeamMember[]>;
}
