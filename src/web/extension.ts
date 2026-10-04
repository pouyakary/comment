import * as vscode from "vscode";
import * as contributions from "./vscode/contributions";
import { justifyCurrentComment } from "./justifier/command";

// ─── Activation Function ───────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
  contributions.registerRenameProviders(context);
  contributions.registerCommandProviders(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("justifier.justify", justifyCurrentComment),
  );
}

// ─── Deactivation Function ─────────────────────────────────────────────── ✣ ─

export function deactivate() {
  // nothing to do
}
