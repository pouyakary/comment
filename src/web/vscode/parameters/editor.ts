import * as engine from "../../engine";
import * as vscode from "vscode";

// ─── Options ───────────────────────────────────────────────────────────── ✣ ─

export interface EnvironmentComputationParameters {
  forcedPosition?: vscode.Position;
  forcedLineContent?: string;
  justRenderTheMainLine?: boolean;
  forcedOrnament?: string;
}

// ─── Compute Environmental Settings ────────────────────────────────────── ✣ ─

export function computeEnvironmentalParameters(
  options?: EnvironmentComputationParameters,
): engine.protocols.EditorParameters {
  const currentEditor = vscode.window.activeTextEditor!;

  const currentLine =
    options?.forcedPosition?.line ?? currentEditor.selection.active.line;

  const currentLineString =
    options?.forcedLineContent ??
    currentEditor.document.lineAt(currentLine).text;

  const currentLanguageId = currentEditor.document.languageId;

  const currentInsertSpacesStatus =
    currentEditor.options.insertSpaces === true
      ? engine.protocols.TabWhitespaceKind.space
      : engine.protocols.TabWhitespaceKind.tab;

  const currentTabSize =
    typeof currentEditor.options.tabSize === "number"
      ? currentEditor.options.tabSize
      : 4;

  const onlyRenderTheMainLine = options?.justRenderTheMainLine ?? false;

  return {
    currentLineNumber: currentLine,
    currentLineText: currentLineString,
    tabWhiteSpaceMode: currentInsertSpacesStatus,
    editorTabSize: currentTabSize,
    languageId: currentLanguageId,
    onlyRenderTheMainLine: onlyRenderTheMainLine,
  };
}
