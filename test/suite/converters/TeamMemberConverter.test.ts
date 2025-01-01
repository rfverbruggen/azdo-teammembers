import assert = require("assert");
import TeamMemberConverter from "../../../src/converters/TeamMemberConverter";

suite("TeamMemberConverter Test Suite", () => {
  test("AzDOTeamMember convert to TeamMember Success", () => {
    // Arrange.
    const azdoTeamMember = {
      identity: {
        id: "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a",
        displayName: "John Doe",
      },
    };

    // Act.
    const teamMember = TeamMemberConverter.ConvertToTeamMember(azdoTeamMember);

    // Assert.
    assert.strictEqual(teamMember.guid, "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a");
    assert.strictEqual(teamMember.name, "John Doe");
  });

  test("AzDOTeamMember with no Id convert to TeamMember Success", () => {
    // Arrange.
    const azdoTeamMember = {
      identity: {
        displayName: "John Doe",
      },
    };

    // Act.
    const teamMember = TeamMemberConverter.ConvertToTeamMember(azdoTeamMember);

    // Assert.
    assert.strictEqual(teamMember.guid, "");
    assert.strictEqual(teamMember.name, "John Doe");
  });

  test("AzDOTeamMember with no Id convert to TeamMember Success", () => {
    // Arrange.
    const azdoTeamMember = {
      identity: {
        id: "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a",
      },
    };

    // Act.
    const teamMember = TeamMemberConverter.ConvertToTeamMember(azdoTeamMember);

    // Assert.
    assert.strictEqual(teamMember.guid, "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a");
    assert.strictEqual(teamMember.name, "");
  });
});
