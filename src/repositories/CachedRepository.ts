import { ICache } from "../interfaces/ICache";
import { ITeamMemberRepository } from "../interfaces/ITeamMemberRepository";
import { TeamMember } from "../models/TeamMember";

export default class CachedRepository implements ITeamMemberRepository {
  constructor(
    private _cache: ICache,
    private _teamMemberRepository: ITeamMemberRepository,
    private _key: string,
    private _expiration: number
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
