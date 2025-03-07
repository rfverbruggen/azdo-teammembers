import * as assert from "assert";
import * as vscode from "vscode";
import { GuidCompletionItemProvider } from "../../../src/providers";
import * as helper from "../../helper";
import TeamMemberFactory from "../../../src/factories/TeamMemberFactory";
import ConfigurationTeamMemberRepository from "../../../src/repositories/ConfigurationTeamMemberRepository";

suite("GuidCompletionItemProvider Test Suite", () => {
  test("NoConfig_ZeroCompletionItems_Success", async () => {
    // Arrange.
    await helper.clearConfig();

    const teamMemberRepository = new ConfigurationTeamMemberRepository();
    const teamMemberFactory = new TeamMemberFactory();
    teamMemberFactory.AddTeamMemberRepository(teamMemberRepository);

    const guidCompletionItemProvider = new GuidCompletionItemProvider(
      teamMemberFactory
    );

    // Act.
    const completionItems =
      (await guidCompletionItemProvider.provideCompletionItems(
        {} as any,
        {} as any,
        {} as any,
        {} as any
      )) as vscode.CompletionItem[];

    // Assert.
    assert.strictEqual(completionItems.length, 0);
  });

  test("ValidConfig_OneCompletionItem_Success", async () => {
    // Arrange.
    const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
    const johnName = "John Doe";

    await helper.changeConfig([{ guid: johnGuid, name: johnName }]);

    const teamMemberRepository = new ConfigurationTeamMemberRepository();
    const teamMemberFactory = new TeamMemberFactory();
    teamMemberFactory.AddTeamMemberRepository(teamMemberRepository);

    const guidCompletionItemProvider = new GuidCompletionItemProvider(
      teamMemberFactory
    );

    // Act.
    const completionItems =
      (await guidCompletionItemProvider.provideCompletionItems(
        {} as any,
        {} as any,
        {} as any,
        {} as any
      )) as vscode.CompletionItem[];

    // Assert.
    assert.strictEqual(completionItems.length, 1);
    assert.strictEqual(completionItems[0].insertText, `<${johnGuid}>`);
    assert.strictEqual(completionItems[0].label, johnName);
  });

  test("ValidConfig_TwoCompletionItems_Success", async () => {
    // Arrange.
    const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
    const johnName = "John Doe";

    const janeGuid = "8ebfe6b2-f151-4797-9956-0b5300db89f2";
    const janeName = "Jane Doe";

    await helper.changeConfig([
      { guid: johnGuid, name: johnName },
      { guid: janeGuid, name: janeName },
    ]);

    const teamMemberRepository = new ConfigurationTeamMemberRepository();
    const teamMemberFactory = new TeamMemberFactory();
    teamMemberFactory.AddTeamMemberRepository(teamMemberRepository);

    const guidCompletionItemProvider = new GuidCompletionItemProvider(
      teamMemberFactory
    );

    // Act.
    const completionItems =
      (await guidCompletionItemProvider.provideCompletionItems(
        {} as any,
        {} as any,
        {} as any,
        {} as any
      )) as vscode.CompletionItem[];

    // Assert.
    assert.strictEqual(completionItems.length, 2);
    assert.strictEqual(completionItems[0].insertText, `<${johnGuid}>`);
    assert.strictEqual(completionItems[0].label, johnName);
    assert.strictEqual(completionItems[1].insertText, `<${janeGuid}>`);
    assert.strictEqual(completionItems[1].label, janeName);
  });
});
