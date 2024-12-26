import { TeamMember } from "../models/TeamMember";

export interface ITeamMemberRepository {
  GetTeamMembers(): TeamMember[];
}
