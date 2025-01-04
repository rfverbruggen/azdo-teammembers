import * as assert from "assert";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { CredentialStore } from "../../../src/azdo/CredentialStore";
import { IAzDOHub } from "../../../src/interfaces/IAzDOHub";
import { suite, test, beforeEach, afterEach } from "mocha";
import { AzDOHub } from "../../../src/azdo/AzDOHub";

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

  test("IsAuthenticated should return true if _azdoAPI is set", () => {
    (credentialStore as any)._azdoAPI = azdoHubStub;
    assert.strictEqual(credentialStore.IsAuthenticated(), true);
  });

  test("IsAuthenticated should return false if _azdoAPI is not set", () => {
    (credentialStore as any)._azdoAPI = undefined;
    assert.strictEqual(credentialStore.IsAuthenticated(), false);
  });

  test("GetHub should return _azdoAPI", () => {
    (credentialStore as any)._azdoAPI = azdoHubStub;
    assert.strictEqual(credentialStore.GetHub(), azdoHubStub);
  });

  test("Login should return undefined if no orgUrl is set", async () => {
    sinon.stub(vscode.workspace, "getConfiguration").returns({
      get: () => undefined,
    } as any);
    const result = await credentialStore.Login();
    assert.strictEqual(result, undefined);
  });

  test("dispose should dispose all disposables", () => {
    const disposable1 = { dispose: sinon.spy() };
    const disposable2 = { dispose: sinon.spy() };
    (credentialStore as any)._disposables.push(disposable1, disposable2);

    credentialStore.dispose();
    assert(disposable1.dispose.calledOnce);
    assert(disposable2.dispose.calledOnce);
  });
});
