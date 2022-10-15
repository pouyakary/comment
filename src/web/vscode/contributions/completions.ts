import * as vscode from 'vscode';
import * as engine from '../../engine';

// ─── Register Completion Services ──────────────────────────────────────── ✣ ─

export function registerCompletionProviders(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "javascript", arendelleSpaceCompletionProvider, "@",
    ),
  );
}


let arendelleSpaceCompletionProvider: vscode.CompletionItemProvider = {
  provideCompletionItems: (
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.CompletionItem[ ] => {

      let item = new vscode.CompletionItem("HELLO WORLD!");
      item.kind = vscode.CompletionItemKind.Constant;
      item.detail = '✨ Section Comment';

      return [
        item,
      ];
  },
};
