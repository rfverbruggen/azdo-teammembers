import { TeamMember } from "../models/TeamMember";
import { TeamMember as AzdoTeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

export default class TeamMemberConverter {
  static ConvertToTeamMember(azdoTeamMember: AzdoTeamMember): TeamMember {
    return {
      guid: azdoTeamMember.identity?.id ?? "",
      name: azdoTeamMember.identity?.displayName ?? "",
    };
  }
}
