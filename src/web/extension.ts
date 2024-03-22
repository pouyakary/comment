import * as vscode from "vscode";
import * as contributions from "./vscode/contributions";

// ─── Activation Function ───────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
  contributions.registerRenameProviders(context);
  contributions.registerCommandProviders(context);
}

// ─── Deactivation Function ─────────────────────────────────────────────── ✣ ─

export function deactivate() {
  // nothing to do
}
