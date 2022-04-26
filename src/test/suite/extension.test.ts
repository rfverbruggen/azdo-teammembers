import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { GuidCompletionItemProvider } from "../../GuidCompletionItemProvider";
import * as path from 'path';

suite('Extension Test Suite', () =>
{
	test('NoConfig_ZeroCompletionItems_Success', () =>
	{
		const completionItems = new GuidCompletionItemProvider().provideCompletionItems({} as any, {} as any, {} as any, {} as any);

		let completionItemsLength = (completionItems as vscode.CompletionItem[]).length;

		assert.strictEqual(completionItemsLength, 0);
	});
});
