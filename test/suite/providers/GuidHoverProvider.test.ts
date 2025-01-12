import * as assert from "assert";
import * as helper from "../../helper";
import * as vscode from "vscode";

suite("GuidHoverProvider Test Suite", () => {
  test("ValidConfig_HoverGuid_Success", async () => {
    // Arrange.
    const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
    const johnName = "John Doe";

    const expectedAnswer = "```azdo-teammember\nJohn Doe\n```\n";

    await helper.changeConfig([{ guid: johnGuid, name: johnName }]);

    const document = helper.openFile(
      `# Heading 1\n\n@<${johnGuid}>`,
      "markdown"
    );

    // Act.
    let hover = <vscode.Hover[]>(
      await vscode.commands.executeCommand(
        "vscode.executeHoverProvider",
        (
          await document
        ).uri,
        new vscode.Position(2, 10)
      )
    );

    // Assert.
    assert.strictEqual(
      (<{ language: string; value: string }>hover[0].contents[0]).value,
      expectedAnswer
    );
  });
});
