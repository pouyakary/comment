import * as vscode from 'vscode';
import * as engine from './engine';

// ─── Activation Function ───────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	// Registerer
	function register(command: string, callback: () => void) {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, callback)
		);
	}

	// Line Comment
	register('comment.vi.makeLineComment', engine.generators.generateLineComment);
}

// ─── Deactivation Function ─────────────────────────────────────────────── ✣ ─

export function deactivate() {
	// nothing to do
}
