import { suite, test, beforeEach } from "mocha";
import * as assert from "assert";
import AzDOTeamMemberRepository from "../../../src/repositories/AzDOTeamMemberRepository";
import { ICredentialStore } from "../../../src/interfaces/ICredentialStore";
import { CoreApi, ICoreApi } from "azure-devops-node-api/CoreApi";
import { TeamMember } from "../../../src/models/TeamMember";
import { TeamMember as AzdoTeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import sinon = require("sinon");
import { CredentialStore } from "../../../src/azdo/credentials";

suite("AzDOTeamMemberRepository", () => {
  let credentialStoreStub: sinon.SinonStubbedInstance<ICredentialStore>;
  let coreApiStub: sinon.SinonStubbedInstance<ICoreApi>;
  let repository: AzDOTeamMemberRepository;

  beforeEach(() => {
    credentialStoreStub =
      sinon.createStubInstance<ICredentialStore>(CredentialStore);
    coreApiStub = sinon.createStubInstance<ICoreApi>(CoreApi);
    repository = new AzDOTeamMemberRepository(credentialStoreStub);
  });

  suite("Ensure", () => {
    test("should initialize credential store if not authenticated", async () => {
      // Arrange.
      credentialStoreStub.IsAuthenticated.returns(false);
      credentialStoreStub.Initialize.resolves();

      // Act.
      await repository.Ensure();

      // Assert.
      assert.strictEqual(credentialStoreStub.Initialize.calledOnce, true);
    });

    test("should not initialize credential store if already authenticated", async () => {
      // Arrange.
      credentialStoreStub.IsAuthenticated.returns(true);

      // Act.
      await repository.Ensure();

      // Assert.
      assert.strictEqual(credentialStoreStub.Initialize.notCalled, true);
    });

    test("should set hub and coreApi after ensuring", async () => {
      // Arrange.
      credentialStoreStub.IsAuthenticated.returns(true);
      const webApiStub = sinon.createStubInstance(CoreApi);
      credentialStoreStub.GetHub.returns({
        // @ts-ignore:next-line
        connection: webApiStub,
      });

      // Act.
      await repository.Ensure();

      // Assert.
      assert.notStrictEqual(repository["_hub"], undefined);
      assert.notStrictEqual(repository["_coreApi"], undefined);
    });
  });

  suite("GetTeamMembers", () => {
    test("should return unique team members", async () => {
      // Arrange.
      const projectIds = ["project1", "project2"];
      const teamIds = ["team1", "team2"];
      const teamMembers = [
        new TeamMember("1", "Member 1"),
        new TeamMember("2", "Member 2"),
        new TeamMember("1", "Member 1"),
      ];

      sinon.stub(repository as any, "GetProjectIds").resolves(projectIds);
      sinon.stub(repository as any, "GetTeamIdsPerProjectId").resolves(teamIds);
      sinon
        .stub(repository as any, "GetTeamMembersPerProjectIdAndTeamId")
        .resolves(teamMembers);

      // Act.
      const result = await repository.GetTeamMembers();

      // Assert.
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].guid, "1");
      assert.strictEqual(result[1].guid, "2");
    });
  });

  suite("Private methods", () => {
    suite("GetProjectIds", () => {
      test("should return project ids", async () => {
        // Arrange.
        const projects = [{ id: "project1" }, { id: "project2" }];
        coreApiStub.getProjects.resolves(projects);

        // Act.
        const result = await (repository as any).GetProjectIds();

        // Assert.
        assert.deepStrictEqual(result, ["project1", "project2"]);
      });
    });

    suite("GetTeamIdsPerProjectId", () => {
      test("should return team ids for a project", async () => {
        // Arrange.
        const teams = [{ id: "team1" }, { id: "team2" }];
        coreApiStub.getTeams.resolves(teams);

        // Act.
        const result = await (repository as any).GetTeamIdsPerProjectId(
          "project1"
        );

        // Assert.
        assert.deepStrictEqual(result, ["team1", "team2"]);
      });
    });

    suite("GetTeamMembersPerProjectIdAndTeamId", () => {
      test("should return team members for a project and team", async () => {
        // Arrange.
        const teamMembers: AzdoTeamMember[] = [
          { identity: { id: "1", displayName: "Member 1" } },
        ];
        coreApiStub.getTeamMembersWithExtendedProperties.resolves(teamMembers);

        // Act.
        const result = await (
          repository as any
        ).GetTeamMembersPerProjectIdAndTeamId("project1", "team1");

        // Assert.
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].guid, "1");
      });
    });
  });
});
