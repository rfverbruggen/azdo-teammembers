import * as sinon from "sinon";
import * as azdev from "azure-devops-node-api";
import { AzDOHub } from "../../../src/azdo/AzDOHub";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import * as assert from "assert";
import { suite, test, beforeEach, afterEach } from "mocha";

suite("AzDOHub", () => {
  const orgUrl = "https://dev.azure.com/organization";
  const token = "fake-token";
  let azDOHub: AzDOHub;
  let getBearerHandlerStub: sinon.SinonStub;
  let webApiStub: sinon.SinonStub;

  beforeEach(() => {
    getBearerHandlerStub = sinon
      .stub(azdev, "getBearerHandler")
      .returns({} as IRequestHandler);
    webApiStub = sinon.stub(azdev, "WebApi").returns({} as azdev.WebApi);
    azDOHub = new AzDOHub(orgUrl, token);
  });

  afterEach(() => {
    sinon.restore();
  });

  test("should initialize with correct orgUrl and token", () => {
    assert.deepEqual(getBearerHandlerStub.calledOnceWith(token, true), true);
    assert.deepEqual(
      webApiStub.calledOnceWith(orgUrl, {} as IRequestHandler),
      true
    );
  });

  test("should set authenticatedUser property to undefined initially", () => {
    assert.deepEqual(azDOHub.authenticatedUser, undefined);
  });

  test("should call GetNewWebApiClient with correct orgUrl", () => {
    const getNewWebApiClientSpy = sinon.spy(azDOHub, "GetNewWebApiClient");
    azDOHub.GetNewWebApiClient(orgUrl);
    assert.deepEqual(getNewWebApiClientSpy.calledOnceWith(orgUrl), true);
  });
});
