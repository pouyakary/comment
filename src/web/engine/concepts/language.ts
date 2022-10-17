import * as protocols from '../protocols';
import * as concepts  from '../concepts';

// ─── Language ──────────────────────────────────────────────────────────── ✣ ─

export class Language {

  // ─── Storage ───────────────────────────────────────────────────── ✣ ─

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

  // ─── Constructor ───────────────────────────────────────────────── ✣ ─

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

  // ─── Comment Width ─────────────────────────────────────────────── ✣ ─

  get totalCommentWidth(): number {
    return this.#leftComment.length + this.#rightComment.length;
  }

  // ─── Wrap Result In Comments ───────────────────────────────────── ✣ ─

  wrapResultInComment(
    indentation:  concepts.Indentation,
    result:       string
  ) {
    return indentation.beginningIndentationWhitespace +
      this.#leftComment + result + this.#rightComment;
  }

  // ─── Wrap Regexp In Comment ────────────────────────────────────── ✣ ─

  wrapCommentDetectionRegExp(regExpBody: string) {
    return new RegExp('^(\\s*)' + Language.#encodeRegExp(this.#leftComment) +
      regExpBody + Language.#encodeRegExp(this.#rightComment) + '$');
  }

  // ─── Encode Regexp Sequence ────────────────────────────────────── ✣ ─

  static #encodeRegExp(sequence: string) {
    return sequence.replace(
      /[\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-]/g,
      (match: string) => `\\${match}`,
    );
  }
}
