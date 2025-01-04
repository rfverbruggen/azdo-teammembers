import { suite, test, beforeEach, afterEach } from "mocha";
import * as assert from "assert";
import AzDOTeamMemberRepository from "../../../src/repositories/AzDOTeamMemberRepository";
import { ICredentialStore } from "../../../src/interfaces/ICredentialStore";
import { CoreApi, ICoreApi } from "azure-devops-node-api/CoreApi";
import sinon = require("sinon");
import { CredentialStore } from "../../../src/azdo/CredentialStore";
import { IAzDOHub } from "../../../src/interfaces/IAzDOHub";
import { AzDOHub } from "../../../src/azdo/AzDOHub";
import { WebApi } from "azure-devops-node-api";
import {
  TeamProjectReference,
  WebApiTeam,
} from "azure-devops-node-api/interfaces/CoreInterfaces";
import {
  TeamMember as AzdoTeamMember,
  IdentityRef,
} from "azure-devops-node-api/interfaces/common/VSSInterfaces";

suite("AzDOTeamMemberRepository", () => {
  let credentialStoreStub: sinon.SinonStubbedInstance<ICredentialStore>;
  let coreApiStub: sinon.SinonStubbedInstance<ICoreApi>;
  let azDOHubStub: sinon.SinonStubbedInstance<IAzDOHub>;
  let webApiStub: sinon.SinonStubbedInstance<WebApi>;
  let repository: AzDOTeamMemberRepository;

  beforeEach(() => {
    credentialStoreStub =
      sinon.createStubInstance<ICredentialStore>(CredentialStore);
    coreApiStub = sinon.createStubInstance<ICoreApi>(CoreApi);
    azDOHubStub = sinon.createStubInstance<IAzDOHub>(AzDOHub);
    webApiStub = sinon.createStubInstance<WebApi>(WebApi);
    repository = new AzDOTeamMemberRepository(credentialStoreStub);
  });

  afterEach(() => {
    sinon.restore();
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
      webApiStub.getCoreApi.resolves(coreApiStub);
      azDOHubStub.connection = webApiStub;
      credentialStoreStub.IsAuthenticated.returns(true);
      credentialStoreStub.GetHub.returns(azDOHubStub);

      // Act.
      repository = await repository.Ensure();

      // Assert.
      assert.notStrictEqual(repository["_hub"], undefined);
      assert.notStrictEqual(repository["_coreApi"], undefined);
    });
  });

  suite("GetTeamMembers", () => {
    test("should return empty array if no team members found", async () => {
      // Arrange.
      const projects: TeamProjectReference[] = [{ id: "1" }];
      const teams: WebApiTeam[] = [{ id: "1" }];
      const teamMembers: AzdoTeamMember[] = [];

      coreApiStub.getProjects.resolves(projects);
      coreApiStub.getTeams.resolves(teams);
      coreApiStub.getTeamMembersWithExtendedProperties.resolves(teamMembers);

      webApiStub.getCoreApi.resolves(coreApiStub);
      azDOHubStub.connection = webApiStub;
      credentialStoreStub.IsAuthenticated.returns(true);
      credentialStoreStub.GetHub.returns(azDOHubStub);

      repository = await repository.Ensure();

      // Act.
      const result = await repository.GetTeamMembers();

      // Assert.
      assert.strictEqual(result.length, 0);
    });

    test("should return empty array if no teams found", async () => {
      // Arrange.
      const projects: TeamProjectReference[] = [
        { id: "1" } as TeamProjectReference,
      ];
      const teams: WebApiTeam[] = [];

      coreApiStub.getProjects.resolves(projects);
      coreApiStub.getTeams.resolves(teams);

      webApiStub.getCoreApi.resolves(coreApiStub);
      azDOHubStub.connection = webApiStub;
      credentialStoreStub.IsAuthenticated.returns(true);
      credentialStoreStub.GetHub.returns(azDOHubStub);

      repository = await repository.Ensure();

      // Act.
      const result = await repository.GetTeamMembers();

      // Assert.
      assert.strictEqual(result.length, 0);
      assert.deepEqual(
        coreApiStub.getTeamMembersWithExtendedProperties.notCalled,
        true
      );
    });

    test("should return empty array if no projects found", async () => {
      // Arrange.
      const projects: TeamProjectReference[] = [];

      coreApiStub.getProjects.resolves(projects);

      webApiStub.getCoreApi.resolves(coreApiStub);
      azDOHubStub.connection = webApiStub;
      credentialStoreStub.IsAuthenticated.returns(true);
      credentialStoreStub.GetHub.returns(azDOHubStub);

      repository = await repository.Ensure();

      // Act.
      const result = await repository.GetTeamMembers();

      // Assert.
      assert.strictEqual(result.length, 0);
      assert.deepEqual(coreApiStub.getTeams.notCalled, true);
    });

    test("should return team members if found", async () => {
      // Arrange.
      const projects: TeamProjectReference[] = [
        { id: "1" } as TeamProjectReference,
      ];
      const teams: WebApiTeam[] = [{ id: "1" } as WebApiTeam];
      const teamMembers: AzdoTeamMember[] = [
        {
          identity: { displayName: "test", id: "1" } as IdentityRef,
        } as AzdoTeamMember,
      ];

      coreApiStub.getProjects.resolves(projects);
      coreApiStub.getTeams.resolves(teams);
      coreApiStub.getTeamMembersWithExtendedProperties.resolves(teamMembers);

      webApiStub.getCoreApi.resolves(coreApiStub);
      azDOHubStub.connection = webApiStub;
      credentialStoreStub.IsAuthenticated.returns(true);
      credentialStoreStub.GetHub.returns(azDOHubStub);

      repository = await repository.Ensure();

      // Act.
      const result = await repository.GetTeamMembers();

      // Assert.
      assert.strictEqual(result.length, 1);
      assert.deepEqual(result[0].guid, teamMembers[0]?.identity?.id);
    });

    test("should return unique team members", async () => {
      // Arrange.
      const projects: TeamProjectReference[] = [
        { id: "1" } as TeamProjectReference,
      ];
      const teams: WebApiTeam[] = [{ id: "1" } as WebApiTeam];
      const teamMembers: AzdoTeamMember[] = [
        {
          identity: { displayName: "test", id: "1" } as IdentityRef,
        } as AzdoTeamMember,
        {
          identity: { displayName: "test", id: "1" } as IdentityRef,
        } as AzdoTeamMember,
      ];

      coreApiStub.getProjects.resolves(projects);
      coreApiStub.getTeams.resolves(teams);
      coreApiStub.getTeamMembersWithExtendedProperties.resolves(teamMembers);

      webApiStub.getCoreApi.resolves(coreApiStub);
      azDOHubStub.connection = webApiStub;
      credentialStoreStub.IsAuthenticated.returns(true);
      credentialStoreStub.GetHub.returns(azDOHubStub);

      repository = await repository.Ensure();

      // Act.
      const result = await repository.GetTeamMembers();

      // Assert.
      assert.strictEqual(result.length, 1);
    });
  });
});
