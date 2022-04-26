import * as vscode from 'vscode';
import { GuidCodeLensProvider } from "./GuidCodeLensProvider";
import { GuidCompletionItemProvider } from "./GuidCompletionItemProvider";

let disposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext)
{
	const guidCompletionItemProvider = new GuidCompletionItemProvider();
	const guidCodeLensProvider = new GuidCodeLensProvider();

	const provider = vscode.languages.registerCompletionItemProvider(
		"markdown",
		guidCompletionItemProvider,
		"@"
	);

	context.subscriptions.push(provider);

	vscode.languages.registerCodeLensProvider("markdown", guidCodeLensProvider);
}

export function deactivate()
{
	if (disposables)
	{
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
