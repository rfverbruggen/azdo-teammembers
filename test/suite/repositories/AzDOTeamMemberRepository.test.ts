import { suite, test, beforeEach } from "mocha";
import * as assert from "assert";
import AzDOTeamMemberRepository from "../../../src/repositories/AzDOTeamMemberRepository";
import { ICredentialStore } from "../../../src/interfaces/ICredentialStore";
import { CoreApi, ICoreApi } from "azure-devops-node-api/CoreApi";
import sinon = require("sinon");
import { CredentialStore } from "../../../src/azdo/credentials";
import { IAzDOHub } from "../../../src/interfaces/IAzDOHub";
import { AzDOHub } from "../../../src/azdo/azdo";
import { WebApi } from "azure-devops-node-api";
import {
  TeamProjectReference,
  WebApiTeam,
} from "azure-devops-node-api/interfaces/CoreInterfaces";
import { TeamMember as AzdoTeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

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
      await repository.Ensure();

      // Assert.
      assert.notStrictEqual(repository["_hub"], undefined);
      assert.notStrictEqual(repository["_coreApi"], undefined);
    });
  });
});
