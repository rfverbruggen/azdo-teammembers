import { ICache } from "../interfaces/ICache";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";

export default class CachedRepository implements ITeamMemberRepository {
  constructor(
    private readonly _cache: ICache,
    private readonly _teamMemberRepository: ITeamMemberRepository,
    private readonly _key: string,
    private readonly _expiration: number
  ) {}

  async GetTeamMembers(): Promise<TeamMember[]> {
    if (this._cache.Has(this._key)) {
      return this._cache.Read(this._key);
    }

    const teamMembers = await this._teamMemberRepository.GetTeamMembers();

    this._cache.Create(this._key, teamMembers, this._expiration);

    return teamMembers;
  }
}
