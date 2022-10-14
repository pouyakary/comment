import * as vscode from 'vscode';

// ─── Replace Line With Given Snippet ───────────────────────────────────── ✣ ─

export function replaceLineWithCurrentSnippet(line: number, text: string) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    editor.edit(textEditorEdit => {
      const {range} = editor.document.lineAt(line);
      textEditorEdit.replace(range, text);
    });

    vscode.commands.executeCommand('cancelSelection');
  }
}
