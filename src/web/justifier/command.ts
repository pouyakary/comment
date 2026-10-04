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
// see       <https://www.gnu.org/licenses/>.

import * as vscode from "vscode";
import { detectStartOfTheComment } from "./sign";
import { justifyMarkdown } from "./monojustify";

// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

/**
 * Width  (in  characters)  of  the justified
 * **body** of a comment line.
 *
 * This  is  measured  AFTER the comment sign
 * and indentation have been stripped, and it
 * is  applied BEFORE they are put back. That
 * means the body width is invariant:  chang-
 * ing the indent, or going from `#` to `//`,
 * does not shrink or grow the  text  —  only
 * the  visible  total  width of the rendered
 * line changes.
 */
const MAX_LINE_SIZE = 42;

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

  // Single-line  block comment: `/** hello */`
  // — must be checked  BEFORE  the  multi-line
  // extractor,  because  that one deliberately
  // bails on  single-line  comments  (and  the
  // line-comment path would mangle them).
  const singleLine = extractSingleLineBlockComment(document, currentLine);
  if (singleLine !== null) {
    justifySingleLineBlockComment(document, singleLine);
    return;
  }

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


// The  prefix  MUST be peeled off every line
// before the body is handed to the  markdown
// justifier.  Otherwise `//` is just another
// token in the paragraph and gets woven into
// the middle of the output.
//
// Empty  comment  lines  (bare  `//` with no
// trailing space, or even with no  indentat-
// ion)  are treated as part of the comment —
// this is what keeps a run of `//  ...\n//\-
// n//   ...`   from   being   seen   as  two
// separate comments.

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function justifyLineComment(
  document: vscode.TextDocument,
  currentLine: number,
  commentSign: string,
): void {
  // `commentSign`  is like `" // "`. Peel
  // the sign itself out.
  const signMatch = commentSign.match(/\S+/);
  if (!signMatch) return;
  const sign = signMatch[0];      // e.g. `"//"`, `"///"`, `"--"`, `"#"`
  const signChar = sign[0];       // used for `/`, `-`, `#`

  // Indentation  from  the  cursor  line  — we
  // re-apply it on output.
  const indent = document.lineAt(currentLine).text.match(/^[ \t]*/)![0];

  // A  line  belongs to this comment if, after
  // stripping leading  whitespace,  it  starts
  // with  `sign` and either is exactly `sign`,
  // or the next  char  is  whitespace,  or  is
  // another  char  from the sign's leading run
  // (e.g. `////` for `//`). Deliberately  ign-
  // ores  indentation  so bare `//` lines with
  // no indent are picked up.
  const isCommentLine = (text: string): boolean => {
    const trimmed = text.trimStart();
    if (!trimmed.startsWith(sign)) return false;
    const rest = trimmed.slice(sign.length);
    if (rest === "") return true;
    return /^\s/.test(rest) || rest.startsWith(signChar);
  };

  // Strip  `"  //  "`  →  `""`,  `" // hello"`
  // → `"hello"`.
  const stripRe = new RegExp(`^[ \\t]*${escapeRegExp(signChar)}+[ \\t]?`);
  const strip = (text: string): string => text.replace(stripRe, "");

  // Expand up/down while lines still belong to
  // this comment.
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

  // Body  width  is  INVARIANT:  it  does  not
  // shrink for indentation or  longer  comment
  // signs.  `#  `  and ` // ` both justify the
  // body to the same character count.
  const bodyWidth = MAX_LINE_SIZE;

  const justifiedBody = justifyMarkdown(bodyLines.join("\n"), {
    maxLineSize: bodyWidth,
  });

  const justifiedLines =
    justifiedBody === "" ? [] : justifiedBody.split("\n");

  // Empty  output  lines  become a bare `sign`
  // with no trailing space.
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

// ─── Justify Single-Line Block Comment (`/** ... */`) ──────────────────── ✣ ─

// A  one-liner like `/** hello */` is expan-
// ded into a proper JSDoc block:
// ```
//     /**
//      * hello
//      */
// ```
// The  markdown  parser cannot be handed the
// raw text: it reads the leading `**` as  an
// emphasis  marker  (or the trailing `*/` as
// content), and the line-comment path  would
// strip  only one `/` before the sign. Expa-
// nding it up-front sidesteps both  problems
// and  makes the result idempotent — re-run-
// ning on the expanded form goes through the
// normal multi-line block path.

function justifySingleLineBlockComment(
  document: vscode.TextDocument,
  info: SingleLineBlockComment,
): void {
  const { lineIndex, indent, bodyContent } = info;

  const prefix = indent + " * ";
  const emptyPrefix = indent + " *";

  // Body        width       is       invariant
  // (see `justifyLineComment`).
  const bodyWidth = MAX_LINE_SIZE;

  const justifiedBody = justifyMarkdown(bodyContent, {
    maxLineSize: bodyWidth,
  });
  const justifiedLines =
    justifiedBody === "" ? [] : justifiedBody.split("\n");

  const outLines = [
    indent + "/**",
    ...justifiedLines.map((line) =>
      line === "" ? emptyPrefix : prefix + line,
    ),
    indent + " */",
  ];

  const finalText = outLines.join("\n") + "\n";
  const range = new vscode.Range(
    new vscode.Position(lineIndex, 0),
    new vscode.Position(lineIndex + 1, 0),
  );
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, range, finalText);
  vscode.workspace.applyEdit(edit);
}

// ─── Justify Block Comment ─────────────────────────────────────────────── ✣ ─

// Strips  the  per-line  border prefix (`" *
// "`, `" * "`, `"* "`, ...) from every  body
// line,  justifies  the  bare markdown body,
// then re-applies the SAME canonical  prefix
// to every produced line. This preserves the
// `*`    column    and    makes     repeated
// runs idempotent.

function justifyBlockComment(
  document: vscode.TextDocument,
  block: ExtractedBlockComment,
): void {
  const {
    startLineIndex,
    endLineIndex,
    startLine,
    endLine,
    prefix,
    emptyPrefix,
    bodyLines,
  } = block;

  // Body  width is invariant — indentation and
  // the ` * ` border are added on top, they do
  // not eat into the body.
  const bodyWidth = MAX_LINE_SIZE;

  const justifiedBody = justifyMarkdown(bodyLines.join("\n"), {
    maxLineSize: bodyWidth,
  });

  const justifiedLines =
    justifiedBody === "" ? [] : justifiedBody.split("\n");

  const newBodyLines = justifiedLines.map((line) =>
    line === "" ? emptyPrefix : prefix + line,
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

// ─── Single-Line Block Extraction ──────────────────────────────────────── ✣ ─

type SingleLineBlockComment = {
  lineIndex: number;
  indent: string;
  bodyContent: string;
};

function extractSingleLineBlockComment(
  document: vscode.TextDocument,
  anchorLine: number,
): SingleLineBlockComment | null {
  const text = document.lineAt(anchorLine).text;
  const indent = text.match(/^[ \t]*/)![0];
  const trimmed = text.trimStart();

  // Only  `/*  ...  */`  and  `/**  ... */`. A
  // continuation `*` line or a  `//`  line  is
  // not a candidate.
  let openLen: number;
  if (trimmed.startsWith("/**")) openLen = 3;
  else if (trimmed.startsWith("/*")) openLen = 2;
  else return null;

  const endIdx = trimmed.indexOf("*/", openLen);
  if (endIdx === -1) return null;

  // Anything  after  the closing marker (other
  // than trailing whitespace) means this isn't
  // a clean single-line block comment.
  const trailing = trimmed.slice(endIdx + 2);
  if (trailing.trim() !== "") return null;

  const bodyContent = trimmed.slice(openLen, endIdx).trim();
  if (bodyContent === "") return null;

  return { lineIndex: anchorLine, indent, bodyContent };
}

// ─── Block Comment Extraction ──────────────────────────────────────────── ✣ ─

type ExtractedBlockComment = {
  startLineIndex: number;
  endLineIndex: number;
  startLine: string;
  endLine: string;
  /**
   * Canonical border prefix, e.g. `"
   * * "`.
   */
  prefix: string;
  /**
   * Prefix  for  lines that end up empty, e.g.
   * `" *"` (no trailing space).
   */
  emptyPrefix: string;
  /**
   * Body lines with the prefix stripped.
   */
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

  const rawBodyLines: string[] = [];
  for (let line = startLineIndex + 1; line < endLineIndex; line++) {
    rawBodyLines.push(document.lineAt(line).text);
  }
  if (rawBodyLines.length === 0) return null;

  // Detect the canonical prefix from the first
  // non-blank body line. It must be  `whitesp-
  // ace*  * optional-whitespace`. If a non-bl-
  // ank body line doesn't match this  at  all,
  // we  bail  —  the  file  isn't  following a
  // JSDoc-like convention and  we  don't  want
  // to guess.
  const prefix = detectBlockCommentPrefix(rawBodyLines);
  if (prefix === null) return null;

  const bodyLines = rawBodyLines.map((line) =>
    stripBlockCommentPrefix(line, prefix),
  );

  return {
    startLineIndex,
    endLineIndex,
    startLine: startLineText,
    endLine: document.lineAt(endLineIndex).text,
    prefix,
    emptyPrefix: prefix.replace(/\s+$/, ""),
    bodyLines,
  };
}

function detectBlockCommentPrefix(bodyLines: string[]): string | null {
  for (const line of bodyLines) {
    if (line.trim() === "") continue;
    const m = line.match(/^(\s*\*\s?)/);
    if (m) return m[1];
    return null;
  }
  return null;
}

function stripBlockCommentPrefix(line: string, prefix: string): string {
  if (line.trim() === "") return "";
  if (line.startsWith(prefix)) return line.slice(prefix.length);

  // Fallback  for lines like `" *"` (no trail-
  // ing space) or other minor deviations  from
  // the canonical prefix.
  const m = line.match(/^(\s*\*\s?)(.*)$/);
  return m ? m[2] : line;
}

// ─── Detection Helpers ─────────────────────────────────────────────────── ✣ ─

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