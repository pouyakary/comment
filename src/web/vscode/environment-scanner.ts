import * as engine from '../engine';
import * as vscode from 'vscode';

// ─── Compute Environmental Settings ────────────────────────────────────── ✣ ─

export function computeEnvironmentalSettings(): engine.protocols.EnvironmentParameters {
  const editor =
    vscode.window.activeTextEditor!;

  const currentLine =
    editor.selection.active.line;

  const currentLineString =
    editor.document.lineAt(currentLine).text;

  const currentLanguageId =
    editor.document.languageId;

  const currentInsertSpacesStatus =
    editor.options.insertSpaces === true
      ? engine.protocols.TabWhitespaceKind.space
      : engine.protocols.TabWhitespaceKind.tab;

  const currentTabSize =
    typeof editor.options.tabSize === 'number'
      ? editor.options.tabSize
      : 4;

  return {
    languageId:               currentLanguageId,
    editorTabSize:            currentTabSize,
    currentLineText:          currentLineString,
    currentLineNumber:        currentLine,
    editorInsertSpaceOrTab:   currentInsertSpacesStatus,
  };
}

