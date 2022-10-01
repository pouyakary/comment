import * as vscode from 'vscode';

// ─── Show Error ────────────────────────────────────────────────────────── ✣ ─

export function showError(error: string) {
  vscode.window.showInformationMessage(`Comment V: Error: ${error}`);
}
