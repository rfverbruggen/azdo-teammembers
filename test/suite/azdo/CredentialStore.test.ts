import * as assert from "assert";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { CredentialStore } from "../../../src/azdo/CredentialStore";
import { IAzDOHub } from "../../../src/interfaces/IAzDOHub";
import { suite, test, beforeEach, afterEach } from "mocha";
import { AzDOHub } from "../../../src/azdo/AzDOHub";
import * as azdev from "azure-devops-node-api";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { ConnectionData } from "azure-devops-node-api/interfaces/LocationsInterfaces";
import { WebApi } from "azure-devops-node-api";

suite("CredentialStore Tests", () => {
  let credentialStore: CredentialStore;
  let getSessionStub: sinon.SinonStub;
  let getTokenStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let azdoHubStub: sinon.SinonStubbedInstance<IAzDOHub>;

  beforeEach(() => {
    credentialStore = new CredentialStore();
    getSessionStub = sinon.stub(vscode.authentication, "getSession");
    getTokenStub = sinon.stub(credentialStore as any, "getToken");
    showErrorMessageStub = sinon.stub(vscode.window, "showErrorMessage");
    azdoHubStub = sinon.createStubInstance<IAzDOHub>(AzDOHub);
  });

  afterEach(() => {
    sinon.restore();
  });

  test("Initialize should call Login", async () => {
    const loginStub = sinon
      .stub(credentialStore, "Login")
      .resolves(azdoHubStub);
    await credentialStore.Initialize();
    assert(loginStub.calledOnce);
  });

  test("Login should return undefined if no orgUrl is set", async () => {
    sinon.stub(vscode.workspace, "getConfiguration").returns({
      get: () => undefined,
    } as any);
    const result = await credentialStore.Login();
    assert.strictEqual(result, undefined);
  });

  test("dispose should dispose all disposables", () => {
    // Arrange.
    const disposable1 = { dispose: sinon.spy() };
    const disposable2 = { dispose: sinon.spy() };
    (credentialStore as any)._disposables.push(disposable1, disposable2);

    // Act.
    credentialStore.dispose();

    // Assert.
    assert(disposable1.dispose.calledOnce);
    assert(disposable2.dispose.calledOnce);
  });

  test("Login should return undefined if no session is returned", async () => {
    // Arrange.
    sinon.stub(vscode.workspace, "getConfiguration").returns({
      get: () => "orgUrl",
    } as any);
    getSessionStub.resolves(undefined);

    // Act.
    const result = await credentialStore.Login();

    // Assert.
    assert.strictEqual(result, undefined);
  });

  test("Login should return undefined if no token is returned", async () => {
    // Arrange.
    sinon.stub(vscode.workspace, "getConfiguration").returns({
      get: () => "orgUrl",
    } as any);
    getSessionStub.resolves({} as vscode.AuthenticationSession);
    getTokenStub.resolves(undefined);

    // Act.
    const result = await credentialStore.Login();

    // Assert.
    assert.strictEqual(result, undefined);
  });

  test("Login should return undefined if user cancels authentication", async () => {
    // Arrange.
    sinon.stub(vscode.workspace, "getConfiguration").returns({
      get: () => "orgUrl",
    } as any);
    getSessionStub.rejects(new Error("User canceled authentication"));

    // Act.
    const result = await credentialStore.Login();

    // Assert.
    assert.strictEqual(result, undefined);
  });

  test("Login should return azdoHub if all conditions are met", async () => {
    // Arrange.
    sinon.stub(vscode.workspace, "getConfiguration").returns({
      get: () => "orgUrl",
    } as any);
    getSessionStub.resolves({} as vscode.AuthenticationSession);
    getTokenStub.resolves("token");

    const webApiStub = sinon.createStubInstance<WebApi>(WebApi);
    webApiStub.connect.resolves({
      authenticatedUser: { id: "1" },
    } as ConnectionData);

    sinon.stub(azdev, "getBearerHandler").returns({} as IRequestHandler);
    sinon.stub(azdev, "WebApi").returns(webApiStub);

    // Act.
    const result = await credentialStore.Login();

    // Assert.
    assert.strictEqual((result as AzDOHub).authenticatedUser?.id, "1");
    assert.strictEqual((result as AzDOHub).orgUrl, "orgUrl");
  });
});
