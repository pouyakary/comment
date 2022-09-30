import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('comment.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Comment VI in a web extension host!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
