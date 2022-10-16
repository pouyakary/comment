import * as vscode from 'vscode';

// ─── Show Error ────────────────────────────────────────────────────────── ✣ ─

export function showError(error: string | Error) {
  let message = typeof error === "string" ? error : error.message;
  vscode.window.showErrorMessage(`🧨 Comment 6: ${message}`);
}
