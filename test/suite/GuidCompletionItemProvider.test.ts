import * as assert from "assert";
import * as vscode from "vscode";
import { GuidCompletionItemProvider } from "../../src/providers";
import { TeamMember } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

suite("GuidCompletionItemProvider Test Suite", () => {
  test("NoConfig_ZeroCompletionItems_Success", async () => {
    // Arrange.
    const teamMembers: TeamMember[] = [];

    // Act.
    const completionItems = new GuidCompletionItemProvider(
      teamMembers
    ).provideCompletionItems(
      {} as any,
      {} as any,
      {} as any,
      {} as any
    ) as vscode.CompletionItem[];

    // Assert.
    assert.strictEqual(completionItems.length, 0);
  });

  test("ValidConfig_OneCompletionItem_Success", async () => {
    // Arrange.
    const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
    const johnName = "John Doe";

    const teamMembers: TeamMember[] = [
      { identity: { id: johnGuid, displayName: johnName } },
    ];

    // Act.
    const completionItems = new GuidCompletionItemProvider(
      teamMembers
    ).provideCompletionItems(
      {} as any,
      {} as any,
      {} as any,
      {} as any
    ) as vscode.CompletionItem[];

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

    const teamMembers: TeamMember[] = [
      { identity: { id: johnGuid, displayName: johnName } },
      { identity: { id: janeGuid, displayName: janeName } },
    ];

    // Act.
    const completionItems = new GuidCompletionItemProvider(
      teamMembers
    ).provideCompletionItems(
      {} as any,
      {} as any,
      {} as any,
      {} as any
    ) as vscode.CompletionItem[];

    // Assert.
    assert.strictEqual(completionItems.length, 2);
    assert.strictEqual(completionItems[0].insertText, `<${johnGuid}>`);
    assert.strictEqual(completionItems[0].label, johnName);
    assert.strictEqual(completionItems[1].insertText, `<${janeGuid}>`);
    assert.strictEqual(completionItems[1].label, janeName);
  });
});
