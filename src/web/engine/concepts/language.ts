import * as protocols from '../protocols';
import * as concepts  from '../concepts';

// ─── Language ──────────────────────────────────────────────────────────── ✣ ─

export class Language {

  /**
   * ```plaintext
   * // ─── Comment Title ─────────────────────────────────── ✣ ─
   * ◀─▶ left comment
   * (* ─── Comment Title ──────────────────────────────── ✣ ─ *)
   * ◀─▶ left comment
   * ```
   */
  readonly #leftComment:    string;

  /**
   * ```plaintext
   * (* ─── Comment Title ──────────────────────────────── ✣ ─ *)
   *                                            right comment ◀─▶
   * ```
   */
  readonly #rightComment:   string;

  readonly sensitive:       boolean;


  constructor({commentGrammar, sensitive}: protocols.LanguageConfigurations) {
    this.sensitive = sensitive;
    if (typeof commentGrammar !== 'string') {
      this.#leftComment   = commentGrammar[0] + ' ';
      this.#rightComment  = ' ' + commentGrammar[1];
      return;
    }
    this.#leftComment   = commentGrammar + ' ';
    this.#rightComment  = '';
  }

  get totalCommentWidth(): number {
    return this.#leftComment.length + this.#rightComment.length;
  }

  wrapResultInComment(
    indentation:  concepts.Indentation,
    result:       string
  ) {
    return indentation.beginningIndentationWhitespace +
      this.#leftComment + result + this.#rightComment;
  }

  wrapCommentDetectionRegExp(regExpBody: string) {
    const code = ( '^([ \\t]*)'
                 + Language.#encodeRegExp(this.#leftComment)
                 + regExpBody
                 + Language.#encodeRegExp(this.#rightComment)
                 + '[ \\t]*$'
                 );
    return new RegExp(code, 'u');
  }

  static #encodeRegExp(sequence: string) {
    return sequence.replace(
      /[\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-]/g,
      (match: string) => `\\${match}`,
    );
  }
}
