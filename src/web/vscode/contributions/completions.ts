import * as vscode    from 'vscode';
import * as engine 		from '../../engine';
import * as tools  		from '../tools';
import * as services 	from '../services';

// ─── Register Completion Services ──────────────────────────────────────── ✣ ─

export function registerCompletionProviders(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "javascript", arendelleSpaceCompletionProvider, ".",
    ),
  );
}


let arendelleSpaceCompletionProvider: vscode.CompletionItemProvider = {
  provideCompletionItems: (
    document: vscode.TextDocument,
    position: vscode.Position,
    token:    vscode.CancellationToken
  ): vscode.CompletionItem[ ] => {

    try {
      const skeleton      = engine.generators.generateSectionComment;
      const finalProduct  = services.executeGenerator(skeleton);
      const item          = new vscode.CompletionItem(finalProduct.result);

      item.kind   = vscode.CompletionItemKind.Constant;
      item.detail = '✨ Section Comment';
      item.preselect = true;

      return [item];

    } catch (error) {
      return [];
    }
  },
};
