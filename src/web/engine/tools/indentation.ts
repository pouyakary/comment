import * as protocols from '../protocols';


// ─── Indentation ───────────────────────────────────────────────────────── ✣ ─

export class Indentation {
  #indentSize:  number;
  #tabSize:     number;

  constructor (line: string, params: protocols.EditorParameters) {
    this.#tabSize = params.editorTabSize;
    this.#indentSize = computeTheWhitespaceCharactersInTheBeginningOfALine(
      line,
      params.editorTabSize,
    );
  }

  /** how many tabs fit in the indentation */
  get indentationLevel(): number {
    return Math.floor(this.#indentSize / this.#tabSize);
  }

  /** Level of indentation, relative to the Kary Coding Standards. */
  get karyStandardsRelativeIndentationLevel(): number {
    return Math.floor(this.indentationLevel / 2);
  }

  /** regenerated whitespace based on the indentation size */
  get asSpaces(): string {
    return ' '.repeat(this.#indentSize);
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
  tabSize:  number
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
