import * as concepts from '.';


// ─── Indentation ───────────────────────────────────────────────────────── ✣ ─

export class Indentation {
  #context:     concepts.GeneratorContext;
  #indentSize:  number;

  constructor (context: concepts.GeneratorContext) {
    this.#context = context;
    this.#indentSize = computeTheWhitespaceCharactersInTheBeginningOfALine(
      context.editorSettings.currentLineText,
      context.editorSettings.editorTabSize,
    );
  }

  /** Shortcut for the context tabsize. */
  get #tabSize(): number {
    return this.#context.editorSettings.editorTabSize;
  }

  /** how many tabs fit in the indentation. */
  get indentationLevel(): number {
    return Math.floor(this.#indentSize / this.#tabSize);
  }

  /** Level of indentation, relative to the Kary Coding Standards. */
  get karyStandardsRelativeIndentationLevel(): number {
    return Math.floor(this.indentationLevel / 2);
  }

  /** Regenerated whitespace based on the indentation size. */
  get asSpaces(): string {
    return ' '.repeat(this.#indentSize);
  }

  /** The whitespace that is used before the final cursor position. */
  get whitespaceBeforeFinalCursorPosition(): string {
    return this.asSpaces;
  }
}

// ─── Compute Line Indentation ──────────────────────────────────────────── ✣ ─

/**
 * Counts the number of spaces and tabs in the beginning of a line.
 * @param line the line we want to process
 * @returns the number of tabs and spaces in the line
 */
function computeTheWhitespaceCharactersInTheBeginningOfALine(
  line:     string,
  tabSize:  number,
): number {
  let index   = 0;
  let spaces  = 0;

  while (index < line.length) {
    switch (line[index]) {
      case '\t':
        spaces += tabSize;
        index++;
        break;

      case ' ':
        spaces++;
        index++;
        break;

      default:
        return spaces;
    }
  }
  return spaces;
}
