import { suite, test, beforeEach } from "mocha";
import * as assert from "assert";
import CachedRepository from "../../../src/repositories/CachedRepository";
import { ICache } from "../../../src/interfaces/ICache";
import { ITeamMemberRepository } from "../../../src/interfaces/ITeamMemberRepository";
import { TeamMember } from "../../../src/models/TeamMember";
import sinon = require("sinon");
import Cache from "../../../src/cache/Cache";
import AzDOTeamMemberRepository from "../../../src/repositories/AzDOTeamMemberRepository";

suite("CachedRepository", () => {
  let cacheStub: sinon.SinonStubbedInstance<ICache>;
  let teamMemberRepositoryStub: sinon.SinonStubbedInstance<ITeamMemberRepository>;
  let cachedRepository: CachedRepository;
  const cacheKey = "teamMembers";
  const cacheExpiration = 3600;
  const teamMembers: TeamMember[] = [{ guid: "1", name: "John Doe" }];

  beforeEach(() => {
    cacheStub = sinon.createStubInstance<ICache>(Cache);
    teamMemberRepositoryStub = sinon.createStubInstance<ITeamMemberRepository>(
      AzDOTeamMemberRepository
    );
    cachedRepository = new CachedRepository(
      cacheStub,
      teamMemberRepositoryStub,
      cacheKey,
      cacheExpiration
    );
  });

  test("should return team members from cache if available", async () => {
    cacheStub.Has.withArgs(cacheKey).returns(true);
    cacheStub.Read.withArgs(cacheKey).returns(teamMembers);

    const result = await cachedRepository.GetTeamMembers();

    assert.strictEqual(result, teamMembers);
    assert.strictEqual(cacheStub.Has.calledOnce, true);
    assert.strictEqual(cacheStub.Read.calledOnce, true);
    assert.strictEqual(teamMemberRepositoryStub.GetTeamMembers.notCalled, true);
  });

  test("should fetch team members from repository and cache them if not in cache", async () => {
    cacheStub.Has.withArgs(cacheKey).returns(false);
    teamMemberRepositoryStub.GetTeamMembers.resolves(teamMembers);

    const result = await cachedRepository.GetTeamMembers();

    assert.strictEqual(result, teamMembers);
    assert.strictEqual(cacheStub.Has.calledOnce, true);
    assert.strictEqual(
      teamMemberRepositoryStub.GetTeamMembers.calledOnce,
      true
    );
    assert.strictEqual(
      cacheStub.Create.calledOnceWithExactly(
        cacheKey,
        teamMembers,
        cacheExpiration
      ),
      true
    );
  });

  test("should handle empty team members list", async () => {
    cacheStub.Has.withArgs(cacheKey).returns(false);
    teamMemberRepositoryStub.GetTeamMembers.resolves([]);

    const result = await cachedRepository.GetTeamMembers();

    assert.deepStrictEqual(result, []);
    assert.strictEqual(cacheStub.Has.calledOnce, true);
    assert.strictEqual(
      teamMemberRepositoryStub.GetTeamMembers.calledOnce,
      true
    );
    assert.strictEqual(
      cacheStub.Create.calledOnceWithExactly(cacheKey, [], cacheExpiration),
      true
    );
  });
});
