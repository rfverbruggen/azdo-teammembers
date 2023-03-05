import * as vscode from 'vscode';

export async function changeConfig(settings: any)
{
	const config = vscode.workspace.getConfiguration();
	await config.update("azdo-teammembers.teammembers", settings, vscode.ConfigurationTarget.Global);
}

export async function clearConfig()
{
	await changeConfig(
		[]
	);
}

export async function openFile(content: string, language?: string): Promise<vscode.TextDocument>
{
	const document = await vscode.workspace.openTextDocument({
		language,
		content,
	});
	vscode.window.showTextDocument(document);
	return document;
}

export async function getLens(uri: vscode.Uri)
{
	return await vscode.commands.executeCommand('vscode.executeCodeLensProvider', uri) as vscode.CodeLens[];
}
