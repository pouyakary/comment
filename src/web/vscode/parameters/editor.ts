import * as engine from '../../engine';
import * as vscode from 'vscode';

// ─── Compute Environmental Settings ────────────────────────────────────── ✣ ─

export function computeEnvironmentalSettings(): engine.protocols.EditorParameters {
  const currentEditor =
    vscode.window.activeTextEditor!;

  const currentLine =
    currentEditor.selection.active.line;

  const currentLineString =
    currentEditor.document.lineAt(currentLine).text;

  const currentLanguageId =
    currentEditor.document.languageId;

  const currentInsertSpacesStatus =
    currentEditor.options.insertSpaces === true
      ? engine.protocols.TabWhitespaceKind.space
      : engine.protocols.TabWhitespaceKind.tab;

  const currentTabSize =
    typeof currentEditor.options.tabSize === 'number'
      ? currentEditor.options.tabSize
      : 4;

  return {
    currentLineNumber:  currentLine,
    currentLineText:    currentLineString,
    tabWhiteSpaceMode:  currentInsertSpacesStatus,
    editorTabSize:      currentTabSize,
    languageId:         currentLanguageId,
  };
}
