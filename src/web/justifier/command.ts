// Justifier  - A comment justifier extension
// for Visual Studio Code that justifies  the
// size   of   comments  lines  to  under  40
// character for better readability.
//
// (C) 2023-present Pouya Kary <kary@gnu.org>
//
// This  program  is  free  software: you can
// redistribute it and/or modify it under the
// terms of the GNU General Public License as
// published by the Free Software Foundation,
// either  version  3  of the License, or (at
// your option) any later version.
//
// This  program  is  distributed in the hope
// that it will be useful,  but  WITHOUT  ANY
// WARRANTY;  without even the implied warra-
// nty of MERCHANTABILITY or  FITNESS  FOR  A
// PARTICULAR  PURPOSE.  See  the GNU General
// Public License for more details.
//
// You should have received a copy of the GNU
// General Public  License  along  with  this
// program.              If              not,
// see <https://www.gnu.org/licenses/>.

import * as vscode from "vscode";
import { detectStartOfTheComment } from "./sign";
import { justifyMarkdown } from "./monojustify";

// ─── Max Line Size ─────────────────────────────────────────────────────── ✣ ─

const MAX_LINE_SIZE = 49;

// ─── Check If The Line Is Comment ──────────────────────────────────────── ✣ ─

export function isLineACommentLine(): boolean {
  const editor = vscode.window.activeTextEditor!;
  const currentLine = editor.selection.active.line;
  const document = editor.document;
  const currentLineContent = document.lineAt(currentLine).text;
  return detectStartOfTheComment(currentLineContent) !== null;
}

// ─── Justify Current Comment ───────────────────────────────────────────── ✣ ─

export function justifyCurrentComment(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const document = editor.document;
  const currentLine = editor.selection.active.line;
  const currentLineContent = document.lineAt(currentLine).text;

  const blockComment = extractBlockComment(document, currentLine);
  if (blockComment !== null) {
    justifyBlockComment(document, blockComment);
    return;
  }

  const commentSign = detectStartOfTheComment(currentLineContent);
  if (commentSign === null) {
    vscode.window.showInformationMessage("Not detected as a supported comment");
    return;
  }

  justifyLineComment(document, currentLine, commentSign);
}

// ─── Justify Line Comment ──────────────────────────────────────────────── ✣ ─

// ─── Justify Line Comment (`//`, `#`, `--`, ...) ───────────────────────── ✣ ─

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function justifyLineComment(
  document: vscode.TextDocument,
  currentLine: number,
  commentSign: string,
): void {
  // `commentSign` is like "    // ". Peel the sign out of it.
  const signMatch = commentSign.match(/\S+/);
  if (!signMatch) return;
  const sign = signMatch[0];            // e.g. "//", "///", "--", "#"
  const signChar = sign[0];             // used for "/+", "#+", "-+"

  // Indentation from the cursor line — we re-apply it on output.
  const indent = document.lineAt(currentLine).text.match(/^[ \t]*/)![0];

  // A line is part of the comment if its trimmed content starts with
  // the sign and is either exactly the sign, or has whitespace, or more
  // of the sign's leading char after it. This deliberately ignores
  // indentation, because editors often strip it from empty comment lines.
  const isCommentLine = (text: string): boolean => {
    const trimmed = text.trimStart();
    if (!trimmed.startsWith(sign)) return false;
    const rest = trimmed.slice(sign.length);
    if (rest === "") return true;
    return /^\s/.test(rest) || rest.startsWith(signChar);
  };

  // Strip "  //   " → "" and "  // hello" → "hello".
  const stripRe = new RegExp(
    `^[ \\t]*${escapeRegExp(signChar)}+[ \\t]?`,
  );
  const strip = (text: string): string => text.replace(stripRe, "");

  // Expand the selection up/down while lines still belong to this comment.
  let startLineIndex = currentLine;
  while (
    startLineIndex > 0 &&
    isCommentLine(document.lineAt(startLineIndex - 1).text)
  ) {
    startLineIndex--;
  }
  let stopLineIndex = currentLine;
  while (
    stopLineIndex + 1 < document.lineCount &&
    isCommentLine(document.lineAt(stopLineIndex + 1).text)
  ) {
    stopLineIndex++;
  }

  const bodyLines: string[] = [];
  for (let i = startLineIndex; i <= stopLineIndex; i++) {
    bodyLines.push(strip(document.lineAt(i).text));
  }

  const prefix = indent + sign + " ";
  const emptyPrefix = indent + sign;
  const bodyWidth = Math.max(10, MAX_LINE_SIZE - prefix.length);

  const justifiedBody = justifyMarkdown(bodyLines.join("\n"), {
    maxLineSize: bodyWidth,
  });

  const justifiedLines =
    justifiedBody === "" ? [] : justifiedBody.split("\n");

  const outLines = justifiedLines.map((line) =>
    line === "" ? emptyPrefix : prefix + line,
  );

  const finalText = outLines.join("\n") + "\n";
  const range = new vscode.Range(
    new vscode.Position(startLineIndex, 0),
    new vscode.Position(stopLineIndex + 1, 0),
  );
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, range, finalText);
  vscode.workspace.applyEdit(edit);
}

// ─── Justify Block Comment (`/** ... */`, `/* ... */`) ─────────────────── ✣ ─

function justifyBlockComment(
  document: vscode.TextDocument,
  block: ExtractedBlockComment,
): void {
  const { startLineIndex, endLineIndex, startLine, endLine, bodyLines } = block;

  // Every body line is guaranteed (by `extractBlockComment`) to start
  // with `*` after trim. Detect the exact prefix from the first body
  // line so a ` *  ` or ` *` convention doesn't get mangled.
  const firstBody = bodyLines[0] ?? "";
  const prefixMatch = firstBody.match(/^(\s*\*\s?)/);
  const prefix = prefixMatch ? prefixMatch[1] : " * ";
  const prefixTrimmed = prefix.replace(/\s+$/, "");

  const strippedBody = bodyLines.map((line) => {
    if (line.startsWith(prefix)) return line.slice(prefix.length);
    const m = line.match(/^(\s*\*\s?)(.*)$/);
    return m ? m[2] : line;
  });

  const bodyWidth = Math.max(10, MAX_LINE_SIZE - prefix.length);
  const justifiedBody = justifyMarkdown(strippedBody.join("\n"), {
    maxLineSize: bodyWidth,
  });

  const justifiedLines =
    justifiedBody === "" ? [] : justifiedBody.split("\n");

  const newBodyLines = justifiedLines.map((line) =>
    line === "" ? prefixTrimmed : prefix + line,
  );

  const reconstructed = [startLine, ...newBodyLines, endLine];
  const finalText = reconstructed.join("\n") + "\n";

  const range = new vscode.Range(
    new vscode.Position(startLineIndex, 0),
    new vscode.Position(endLineIndex + 1, 0),
  );
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, range, finalText);
  vscode.workspace.applyEdit(edit);
}

// ─── Block Comment Extraction (unchanged) ──────────────────────────────── ✣ ─

type ExtractedBlockComment = {
  startLineIndex: number;
  endLineIndex: number;
  startLine: string;
  endLine: string;
  bodyLines: string[];
};

function extractBlockComment(
  document: vscode.TextDocument,
  anchorLine: number,
): ExtractedBlockComment | null {
  const anchorText = document.lineAt(anchorLine).text;

  if (!isBlockCommentCandidate(anchorText)) return null;

  const startLineIndex = findBlockCommentStart(document, anchorLine);
  if (startLineIndex === null) return null;

  const startLineText = document.lineAt(startLineIndex).text;
  if (isSingleLineBlockComment(startLineText)) return null;

  const endLineIndex = findBlockCommentEnd(document, startLineIndex);
  if (endLineIndex === null || endLineIndex === startLineIndex) return null;

  const bodyLines: string[] = [];
  for (let line = startLineIndex + 1; line < endLineIndex; line++) {
    bodyLines.push(document.lineAt(line).text);
  }

  if (bodyLines.length === 0) return null;

  const bodyHasOnlyStarPrefix = bodyLines.every((line) =>
    line.trim().startsWith("*"),
  );
  if (!bodyHasOnlyStarPrefix) return null;

  return {
    startLineIndex,
    endLineIndex,
    startLine: startLineText,
    endLine: document.lineAt(endLineIndex).text,
    bodyLines,
  };
}

function isBlockCommentCandidate(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  return (
    trimmed.startsWith("/**") ||
    (trimmed.startsWith("/*") && !trimmed.startsWith("//")) ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("*/")
  );
}

function findBlockCommentStart(
  document: vscode.TextDocument,
  fromLine: number,
): number | null {
  for (let line = fromLine; line >= 0; line--) {
    const text = document.lineAt(line).text;
    if (
      line !== fromLine &&
      containsCommentEnd(text) &&
      !containsBlockStart(text)
    ) {
      return null;
    }
    if (containsBlockStart(text)) return line;
  }
  return null;
}

function findBlockCommentEnd(
  document: vscode.TextDocument,
  fromLine: number,
): number | null {
  for (let line = fromLine; line < document.lineCount; line++) {
    if (containsCommentEnd(document.lineAt(line).text)) return line;
  }
  return null;
}

function containsBlockStart(text: string): boolean {
  return text.indexOf("/*") !== -1;
}

function containsCommentEnd(text: string): boolean {
  return text.indexOf("*/") !== -1;
}

function isSingleLineBlockComment(text: string): boolean {
  const start = text.indexOf("/*");
  if (start === -1) return false;
  return text.indexOf("*/", start + 2) !== -1;
}