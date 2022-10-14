import * as vscode from 'vscode';

// ─── Show Error ────────────────────────────────────────────────────────── ✣ ─

export function showError(message: string) {
  vscode.window.showInformationMessage(`Comment VI Error: ${message}`);
}
