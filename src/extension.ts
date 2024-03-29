import * as vscode from 'vscode';
import { GuidCompletionItemProvider, GuidCodeLensProvider, GuidHoverProvider } from './providers';

let disposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext) {
	const registeredCompletionItemProvider = vscode.languages.registerCompletionItemProvider(
		"markdown",
		new GuidCompletionItemProvider(),
		"@"
	);

	const registeredCodeLensProvider = vscode.languages.registerCodeLensProvider(
		"markdown",
		new GuidCodeLensProvider()
	);

	const registeredHoverProvider = vscode.languages.registerHoverProvider(
		"markdown",
		new GuidHoverProvider()
	);

	context.subscriptions.push(registeredCompletionItemProvider);
	context.subscriptions.push(registeredCodeLensProvider);
	context.subscriptions.push(registeredHoverProvider);
}

export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
