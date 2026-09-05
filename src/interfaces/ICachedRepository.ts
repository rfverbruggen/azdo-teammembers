import { ITeamMemberRepository } from "./ITeamMemberRepository";

export interface ICachedRepository extends ITeamMemberRepository {
  RefreshCache(): void | Promise<void>;
}
