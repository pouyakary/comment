import * as protocols from '.';

// ─── Comment Environment Context ───────────────────────────────────────── ✣ ─

/**
 * Generator context is the computed settings that is
 * passed to the comment generator.
 */
export interface GeneratorContext {
  /**
   * Number of the spaces in total that define the current indentation.
   * So lets say you have _2 tabs_ and _1 space_. The _current tab size
   * is 4_ therefore the indentationSize becomes:
   * > 2 * 4 + 1 = 9
   */
  readonly indentationSize: number

  /** The Code Editor's line number */
  readonly lineNumber: number

  /**
   * The legacy version of the comment used to have a different look and
   * style which is no longer in use today. Multi line section comment
   * styles incorporating upper case names have given their place to All
   * Caps and one line style.
   */
  readonly legacyMode: boolean

  /**
   * The ornament is a comment that is signature or a decoration placed
   * at the very end of the comments. If the string is empty, the ornament
   * is not defined and not rendered.
   */
  readonly ornament: string

  /**
   * These are the language specific configurations for the way the
   * handle the indentation and spacing and how their comments look like.
   */
  readonly languageConfig: protocols.LanguageConfigurations
}
