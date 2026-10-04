// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

const LINE_BREAK_RE = /\r?\n/;
const WHITESPACE_RE = /\s+/;
const FENCE_RE = /^\s*(`{3,}|~{3,})/;
const HR_RE = /^\s*([-*_])(?:\s*\1){2,}\s*$/;
const HEADING_RE = /^\s*#{1,6}\s+/;
const QUOTE_RE = /^\s*>\s?(.*)$/;
const LIST_RE = /^(\s*)([-*+]|\d+[.)])(\s+)(.*)$/;

// ─── Types ─────────────────────────────────────────────────────────────── ✣ ─

export interface IMonoJustifierOptions {
  /**
   * Maximum  number of characters per ou-
   * tput line. Clamped to ≥ 10.
   */
  maxLineSize: number;

  /**
   * Threshold  for the "badness" heurist-
   * ic: how  empty  a  line  has  to  be,
   * relative  to its gaps, before we pre-
   * fer to hyphenate a  word  instead  of
   * leaving  the  line  ragged.  Higher →
   * split less eagerly.
   */
  splitChunkEmptySpaceFactor?: number;
  /**
   * Character  used to mark a split word.
   * Default `"-"`.
   */
  splitHyphen?: string;
}

export interface IMarkdownJustifierOptions extends IMonoJustifierOptions { }

type Block =
  | { kind: "blank" }
  | { kind: "raw"; lines: string[] }
  | { kind: "paragraph"; lines: string[] }
  | { kind: "quote"; blocks: Block[] }
  | { kind: "list"; items: ListItem[] };

interface ListItem {
  /** Marker plus trailing space, e.g. `"- "` or `"1. "`. */
  marker: string;
  /** Item content with the marker indent already stripped. */
  blocks: Block[];
}


// ─── Mono Justifier ────────────────────────────────────────────────────── ✣ ─

export class MonoJustifier {

  // ─── Storage ─────────────────────────────────────────────────────────

  readonly #maxLineSize: number;
  readonly #splitHyphen: string;
  readonly #splitChunkEmptySpaceFactor: number;

  // ─── Constructor ─────────────────────────────────────────────────────

  constructor(options: IMonoJustifierOptions) {
    this.#maxLineSize = Math.max(10, options.maxLineSize);
    this.#splitHyphen = options.splitHyphen ?? "-";
    this.#splitChunkEmptySpaceFactor =
      options.splitChunkEmptySpaceFactor ?? 0.75;
  }

  // ─── Justify Text ────────────────────────────────────────────────────

  /**
   * Justify  a blob of text line by line.
   * Blank lines pass through.
   */
  justifyText(input: string): string {
    return this.justifyLines(input.split(LINE_BREAK_RE)).join("\n");
  }

  // ─── Justify Lines ───────────────────────────────────────────────────

  /** Justify an array of pre-split lines. */
  justifyLines(input: string[]): string[] {
    return this.#distributeSpaces(this.#packLines(this.#extractChunks(input)));
  }

  // ─── Extract Chunk ───────────────────────────────────────────────────

  // Re-assembles  words  that  a previous
  // justification  pass  may  have  split
  // across  lines  ("extr-"  / "aordi-" /
  // "nary"). A trailing  split-hyphen  on
  // the last chunk of a line buffers that
  // head so it can be glued to the  first
  // chunk of the next line.

  #extractChunks(lines: string[]): string[] {
    const chunks: string[] = [];
    let pendingHead: string | null = null;

    for (const line of lines) {
      const parts = line.split(WHITESPACE_RE);

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") continue;

        const isLast = i === parts.length - 1;
        const isHead =
          isLast &&
          part.length > this.#splitHyphen.length &&
          part.endsWith(this.#splitHyphen);

        if (isHead) {
          pendingHead = part.slice(0, -this.#splitHyphen.length);
          continue;
        }

        chunks.push(pendingHead === null ? part : pendingHead + part);
        pendingHead = null;
      }
    }

    // Dangling  head: input ended mid-wo-
    // rd. Flush it with its hyphen rather
    // than silently dropping it.
    if (pendingHead !== null) {
      chunks.push(pendingHead + this.#splitHyphen);
    }

    // Return as a stack so pop() yields chunks in reading order.
    return chunks.reverse();
  }


  // ─── Split Chunk ─────────────────────────────────────────────────────

  // Caller  guarantees  `available  >= 4`
  // and `chunk.length >= 6`, so we always
  // leave  ≥1 char on each side plus room
  // for the hyphen.

  #splitChunk(chunk: string, available: number): [string, string] {
    // 1  char  for the preceding space, 1
    // for the trailing hyphen.
    const headRoom = available - 2;
    const headSize = Math.max(1, Math.min(headRoom, chunk.length - 3));
    return [chunk.slice(0, headSize), chunk.slice(headSize)];
  }

  // ─── Pack Chunks Into Lines ──────────────────────────────────────────

  #packLines(chunks: string[]): string[][] {
    const lines: string[][] = [];
    let buffer: string[] = [];
    let bufferLength = 0;

    const flush = (): void => {
      if (buffer.length === 0) return; // ← the fix that kills "undefined"
      lines.push(buffer);
      buffer = [];
      bufferLength = 0;
    };

    while (chunks.length > 0) {
      const chunk = chunks.pop()!;
      const gap = buffer.length === 0 ? 0 : 1;
      const projected = bufferLength + gap + chunk.length;

      if (projected > this.#maxLineSize) {
        const available = this.#maxLineSize - bufferLength - gap;
        const badness =
          buffer.length === 0 ? Infinity : available / buffer.length;

        const shouldSplit =
          chunks.length > 3 &&
          chunk.length >= 6 &&
          available >= 4 &&
          badness > this.#splitChunkEmptySpaceFactor;

        if (shouldSplit) {
          const [head, tail] = this.#splitChunk(chunk, available);
          chunks.push(tail);
          buffer.push(head + this.#splitHyphen);
          bufferLength += gap + head.length + this.#splitHyphen.length;
          flush();
          continue;
        }

        if (buffer.length > 0) {
          // Can't split; close the line and retry on a fresh one.
          flush();
          chunks.push(chunk);
          continue;
        }
        // Empty line + oversized chunk: accept the overflow.
      }

      buffer.push(chunk);
      bufferLength += gap + chunk.length;
    }

    flush();

    // Orphan control: pull the last chunk
    // of the penultimate line down so the
    // last  line  isn't  a  single lonely
    // word — but only when the  resulting
    // line  still  fits.  (Original  code
    // could break the "each gap  gets  ≥1
    // space" invariant here.)
    if (lines.length > 1) {
      const last = lines[lines.length - 1];
      const previous = lines[lines.length - 2];
      if (last.length === 1 && previous.length > 1) {
        const candidate = previous[previous.length - 1];
        if (candidate.length + 1 + last[0].length <= this.#maxLineSize) {
          previous.pop();
          lines[lines.length - 1] = [candidate, ...last];
        }
      }
    }

    return lines;
  }

  // ─── Distribute Space ────────────────────────────────────────────────

  #distributeSpaces(lines: string[][]): string[] {
    const result: string[] = [];
    const raggedThreshold = Math.ceil(this.#maxLineSize * 0.15);

    for (let i = 0; i < lines.length; i++) {
      const chunks = lines[i];

      if (chunks.length === 0) {
        result.push("");
        continue;
      }
      if (chunks.length === 1) {
        result.push(chunks[0]);
        continue;
      }

      const gaps = chunks.length - 1;
      const contentLength = chunks.reduce((n, c) => n + c.length, 0);
      const emptySize = this.#maxLineSize - contentLength;
      const isLast = i === lines.length - 1;

      // Ragged  last line (avoid stretch-
      // ing it), or a  line  that  cannot
      // legally  be justified (less empty
      // space than gaps → words fuse).
      if ((isLast && emptySize > raggedThreshold) || emptySize < gaps) {
        result.push(chunks.join(" "));
        continue;
      }

      const spaces = new Array<string>(gaps).fill("");
      let remaining = emptySize;
      let counter = 0;
      while (remaining-- > 0) {
        spaces[counter++ % gaps] += " ";
      }

      // Alternate  distribution direction
      // per line to break up rivers.
      let line = "";
      for (let j = 0; j < gaps; j++) {
        const spaceIndex = i % 2 === 0 ? j : gaps - j - 1;
        line += chunks[j] + spaces[spaceIndex];
      }
      line += chunks[chunks.length - 1];
      result.push(line);
    }

    return result;
  }
}

// ─── Parse Blocks ──────────────────────────────────────────────────────── ✣ ─

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line → paragraph separator.
    if (line.trim() === "") {
      blocks.push({ kind: "blank" });
      i++;
      continue;
    }

    // ─── Fence Code ──────────────────────────────────────────────

    const fence = line.match(FENCE_RE);
    if (fence) {
      const token = fence[1];
      const char = token[0];
      const length = token.length;
      const code: string[] = [line];
      i++;
      while (i < lines.length) {
        const l = lines[i];
        code.push(l);
        i++;
        const m = l.match(FENCE_RE);
        if (m && m[1][0] === char && m[1].length >= length) break;
      }
      blocks.push({ kind: "raw", lines: code });
      continue;
    }

    // ─── Horizontal Rule ─────────────────────────────────────────

    if (HR_RE.test(line)) {
      blocks.push({ kind: "raw", lines: [line] });
      i++;
      continue;
    }

    // ─── Headings ────────────────────────────────────────────────

    if (HEADING_RE.test(line)) {
      blocks.push({ kind: "raw", lines: [line] });
      i++;
      continue;
    }

    // ─── Blockquote ──────────────────────────────────────────────

    if (QUOTE_RE.test(line)) {
      const inner: string[] = [];
      while (i < lines.length && QUOTE_RE.test(lines[i])) {
        inner.push(lines[i].replace(QUOTE_RE, "$1"));
        i++;
      }
      blocks.push({ kind: "quote", blocks: parseBlocks(inner) });
      continue;
    }

    // ─── List ────────────────────────────────────────────────────

    const listStart = line.match(LIST_RE);
    if (listStart) {
      const baseIndent = listStart[1].length;
      const items: ListItem[] = [];

      while (i < lines.length) {
        const itemLine = lines[i];

        // Blank  line: only ends the list
        // if nothing at  the  same  level
        // follows.  Otherwise it's a loo-
        // se-list separator — preserve it
        // by  attaching  a blank block to
        // the  previous  item  so   empty
        // comment lines round-trip.
        if (itemLine.trim() === "") {
          let j = i + 1;
          while (j < lines.length && lines[j].trim() === "") j++;
          if (j >= lines.length) break;
          const nextMatch = lines[j].match(LIST_RE);
          if (!nextMatch || nextMatch[1].length !== baseIndent) break;

          const lastItem = items[items.length - 1];
          if (lastItem) lastItem.blocks.push({ kind: "blank" });
          i = j;
          continue;
        }

        const m = itemLine.match(LIST_RE);
        if (!m || m[1].length !== baseIndent) break;

        const marker = m[2] + " ";
        const contentIndent = baseIndent + marker.length;
        const itemLines: string[] = [m[4]];
        i++;

        // Continuations:   anything  that
        // isn't a new item at this level,
        // isn't a different block opener,
        // and isn't blank. Indented  con-
        // tinuations  are trimmed to `co-
        // ntentIndent`; lazy (unindented)
        // continuations    are   accepted
        // as-is — this is what fixes  the
        // "list in the bottom doesn't get
        // justified" case.
        while (i < lines.length) {
          const cont = lines[i];
          if (cont.trim() === "") break;

          const contMatch = cont.match(LIST_RE);
          if (contMatch && contMatch[1].length === baseIndent) break;

          if (
            FENCE_RE.test(cont) ||
            HR_RE.test(cont) ||
            HEADING_RE.test(cont) ||
            QUOTE_RE.test(cont)
          ) {
            break;
          }

          const leading = cont.match(/^\s*/)![0].length;
          const trim = Math.min(leading, contentIndent);
          itemLines.push(cont.slice(trim));
          i++;
        }

        items.push({ marker, blocks: parseBlocks(itemLines) });
      }

      blocks.push({ kind: "list", items });
      continue;
    }

    // ─── Paragraph ───────────────────────────────────────────────

    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim() === "") break;
      if (
        FENCE_RE.test(l) ||
        HR_RE.test(l) ||
        HEADING_RE.test(l) ||
        QUOTE_RE.test(l) ||
        LIST_RE.test(l)
      ) {
        break;
      }
      paragraphLines.push(l);
      i++;
    }
    blocks.push({ kind: "paragraph", lines: paragraphLines });
  }

  return blocks;
}

// ─── Render Blocks ─────────────────────────────────────────────────────── ✣ ─

function renderBlocks(
  blocks: Block[],
  width: number,
  justifier: MonoJustifier
): string[] {
  const out: string[] = [];
  for (const block of blocks) {
    out.push(...renderBlock(block, width, justifier));
  }
  return out;
}

// ─── Render Block ──────────────────────────────────────────────────────── ✣ ─

function renderBlock(
  block: Block,
  width: number,
  justifier: MonoJustifier
): string[] {
  switch (block.kind) {
    case "blank":
      return [""];

    case "raw":
      return block.lines;

    case "paragraph":
      return justifier.justifyLines(block.lines);

    case "quote": {
      // 2 chars reserved for "> " on every line.
      const innerWidth = Math.max(10, width - 2);
      const inner = renderBlocks(block.blocks, innerWidth, justifier);
      return inner.map((line) => (line === "" ? ">" : `> ${line}`));
    }

    case "list": {
      const out: string[] = [];
      for (const item of block.items) {
        const indent = item.marker.length;
        const innerWidth = Math.max(10, width - indent);
        const inner = renderBlocks(item.blocks, innerWidth, justifier);
        const continuation = " ".repeat(indent);

        inner.forEach((line, index) => {
          if (line === "") {
            out.push("");
            return;
          }
          // First line of the item gets the marker; the rest are
          // indented to align under the item's text.
          out.push((index === 0 ? item.marker : continuation) + line);
        });
      }
      return out;
    }
  }
}

// ─── Justify Markdown ──────────────────────────────────────────────────── ✣ ─

/**
 * Justify markdown-formatted text (e.g. a
 * code  comment)  at  the  given   width,
 * preserving markdown structure.
 *
 * Supports:  paragraphs, fenced code, ho-
 * rizontal rules,  headings,  blockquotes
 * (nested),             unordered/ordered
 * lists (nested).
 */
export function justifyMarkdown(
  input: string,
  options: IMarkdownJustifierOptions
): string {
  const justifier = new MonoJustifier(options);
  const lines = input.split(LINE_BREAK_RE);
  const blocks = parseBlocks(lines);
  const rendered = renderBlocks(blocks, options.maxLineSize, justifier);

  // Trim leading/trailing blank lines that came from the split.
  let start = 0;
  let end = rendered.length;
  while (start < end && rendered[start] === "") start++;
  while (end > start && rendered[end - 1] === "") end--;

  return rendered.slice(start, end).join("\n");
}