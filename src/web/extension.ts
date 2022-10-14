import * as vscode from 'vscode';
import * as commands from './vscode/commands';

// ─── Activation Function ───────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	// Registerer
	function register(command: string, callback: () => void) {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, callback)
		);
	}

	// Line Comment
	register('comment.vi.makeLineComment', commands.generateLineComment);
}

// ─── Deactivation Function ─────────────────────────────────────────────── ✣ ─

export function deactivate() {
	// nothing to do
}
