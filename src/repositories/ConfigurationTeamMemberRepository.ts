import * as vscode from "vscode";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";
import { SETTINGS_SECTION, SETTINGS_TEAMMEMBERS } from "../constants";

export default class ConfigurationTeamMemberRepository
  implements ITeamMemberRepository
{
  GetTeamMembers(): TeamMember[] {
    return vscode.workspace
      .getConfiguration(SETTINGS_SECTION)
      .get(SETTINGS_TEAMMEMBERS, []);
  }
}
