import * as assert from 'assert';
import * as helper from "../helper";

suite('GuidCodeLensProvider Test Suite', () =>
{
	test('NoConfig_ZeroCodeLenses_Success', async () =>
	{
		// Arrange.
		await helper.clearConfig();

		const document = helper.openFile('# Heading 1\n\nJust some text', "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 0);
	});

	test('ValidConfig_OneCodeLens_Success', async () =>
	{
		// Arrange.
		const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
		const johnName = "John Doe";

		await helper.changeConfig([{ "guid": johnGuid, "name": johnName }]);

		const document = helper.openFile(`# Heading 1\n\n@<${johnGuid}>`, "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 1);
		assert.strictEqual(lens[0].command?.title, johnName);
	});

	test('ValidConfig_OneCodeLensInline_Success', async () =>
	{
		// Arrange.
		const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
		const johnName = "John Doe";

		await helper.changeConfig([{ "guid": johnGuid, "name": johnName }]);

		const document = helper.openFile(`# Heading 1\n\nThis is a chapter about @<${johnGuid}>, who is a developer.`, "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 1);
		assert.strictEqual(lens[0].command?.title, johnName);
	});

	test('ValidConfig_TwoCodeLens_Success', async () =>
	{
		// Arrange.
		const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
		const johnName = "John Doe";

		const janeGuid = "8ebfe6b2-f151-4797-9956-0b5300db89f2";
		const janeName = "Jane Doe";

		await helper.changeConfig([
			{ "guid": johnGuid, "name": johnName },
			{ "guid": janeGuid, "name": janeName }
		]);

		const document = helper.openFile(`# Heading 1\n\n@<${johnGuid}>\n\n@<${janeGuid}>`, "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 2);
		assert.strictEqual(lens[0].command?.title, johnName);
		assert.strictEqual(lens[1].command?.title, janeName);
	});

	test('ValidConfig_TwoCodeLensInline_Success', async () =>
	{
		// Arrange.
		const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
		const johnName = "John Doe";

		const janeGuid = "8ebfe6b2-f151-4797-9956-0b5300db89f2";
		const janeName = "Jane Doe";

		await helper.changeConfig([
			{ "guid": johnGuid, "name": johnName },
			{ "guid": janeGuid, "name": janeName }
		]);

		const document = helper.openFile(`# Heading 1\n\n@<${johnGuid}> and @<${janeGuid}>`, "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 2);
		assert.strictEqual(lens[0].command?.title, johnName);
		assert.strictEqual(lens[1].command?.title, janeName);
	});

	test('GuidDifferentCasing_OneCodeLens_Success', async () =>
	{
		// Arrange.
		const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
		const johnName = "John Doe";

		await helper.changeConfig([{ "guid": johnGuid, "name": johnName }]);

		const document = helper.openFile(`# Heading 1\n\n@<${johnGuid.toUpperCase()}>`, "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 1);
		assert.strictEqual(lens[0].command?.title, johnName);
	});

	test('GuidNotInConfig_ZeroCodeLenses_Success', async () =>
	{
		// Arrange.
		const johnGuid = "f5b3c8dd-1c9d-4ddf-92f4-c52b195da01a";
		const johnName = "John Doe";

		const janeGuid = "8ebfe6b2-f151-4797-9956-0b5300db89f2";

		await helper.changeConfig([{ "guid": johnGuid, "name": johnName }]);

		const document = helper.openFile(`# Heading 1\n\n@<${janeGuid}>`, "markdown");

		// Act.
		const lens = await helper.getLens((await document).uri);

		// Assert.
		assert.strictEqual(lens.length, 0);
	});
});
