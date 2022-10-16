import * as protocols from '../protocols';
import * as concepts  from '.';

// ─── Generator Context Constructor Parameters ──────────────────────────── ✣ ─

export interface GeneratorContextConstructorParams {
  userSettings:     protocols.UserSettings;
  editorSettings:   protocols.EditorParameters;
  languageConfig:   protocols.LanguageConfigurations;
}

// ─── Comment Environment Context ───────────────────────────────────────── ✣ ─

/**
 * Generator context is the computed settings that is passed to the comment
 * generator and comment verifier. It is the heart of information that is
 * passed around in the factory line of comment generation and in parts, kind
 * of a convenience that provides shortcuts for common important information.
 */
export class GeneratorContext {
  readonly #languageConfig:   protocols.LanguageConfigurations;
  readonly #userSettings:     protocols.UserSettings;
  readonly #editorSettings:   protocols.EditorParameters;

  constructor(params: GeneratorContextConstructorParams) {
    this.#userSettings   = params.userSettings;
    this.#editorSettings = params.editorSettings;
    this.#languageConfig = params.languageConfig;
  }

  /**
   * Returns a new Indentation object instance computed as
   * on the parameters of this context.
   */
  get indentation(): concepts.Indentation {
    return new concepts.Indentation(this);
  }

  /** The current editor line data */
  get line(): string {
    return this.#editorSettings.currentLineText;
  }

  /**
   * Whitespace normalized input of the comment generation system.
   */
  get whitespaceNormalizedInput(): string {
    return this.line
        .trim()
        .split(/\s+/g).join(' ');
  }

  /** The current editor line number */
  get lineNumber(): number {
    return this.#editorSettings.currentLineNumber;
  }

  /** Editor tab size */
  get tabSize(): number {
    return this.#editorSettings.editorTabSize;
  }

  /**
   * Returns the current ornament of the user settings.
   */
  get ornament(): concepts.Ornament {
    return new concepts.Ornament(this.#userSettings.ornament);
  }

  /**
   * Width of the resulting comment. (Excluding the indentation)
   */
  get totalCommentWidth(): number {
    return this.rootLevelCommentWidth - (this.indentation.indentationLevel * this.indentationLevelWidthDifference);
  }

  /**
   * ```plaintext
   * // ─── Comment Title ─────────────────────────────────── ✣ ─
   * ◀─▶ comment grammar prefix
   * ```
   */
  get commentGrammarPrefix(): string {
    return this.#languageConfig.chars.middle + ' ';
  }

  /**
   * The width of a comment without the ornament and language parts:
   * ```plaintext
   * ◀────────────────────────────────────────────────▶ A
   * // ─── Comment Title ───────────────────────── ✣ ─
   * ◀─▶ B                                        ◀───▶ C
   *    ◀────────────────────────────────────────▶ D
   * ```
   * - (A) Total comment length.
   * - (B) Comment Grammar Prefix.
   * - (C) Ornament Part.
   * - (D) body available space
   *
   * D = A - (B + C)
   */
  get commentBodyAvailableSpace(): number {
    return this.totalCommentWidth
      - this.commentGrammarPrefix.length
      - this.ornament.size;
  }

  get rootLevelCommentWidth(): number {
    return this.#userSettings.rootCommentWidth;
  }

  get indentationLevelWidthDifference(): number {
    return this.#userSettings.indentationLevelWidthDifference;
  }

  get codeStartsAtOneMoreLevelOfIndentation(): boolean {
    return this.#userSettings.codeStartsAtOneMoreLevelOfIndentation;
  }
}

