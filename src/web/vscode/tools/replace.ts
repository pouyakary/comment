import * as vscode from 'vscode';

// ─── Replace Line With Given Snippet ───────────────────────────────────── ✣ ─

export async function replaceLineWithCurrentSnippet(
  lineNumber: number, text: string
) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    editor.edit(textEditorEdit => {
      const {range} = editor.document.lineAt(lineNumber);
      textEditorEdit.replace(range, text);
    });

    await vscode.commands.executeCommand('cancelSelection');
  }
}
