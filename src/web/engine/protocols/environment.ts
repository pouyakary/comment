// ─── Tab Kind ──────────────────────────────────────────────────────────── ✣ ─

/**
 * How a whitespace is rendered. With a tab or placing spaces instead
 * of the tab.
 */
export enum TabWhitespaceKind {
  tab, space
}

// ─── Environment Parameters ────────────────────────────────────────────── ✣ ─

/**
 * These are the environmental settings of the editor. They determine
 * the context int which the comment is going to be generated and by
 * listening to them the user can generate the comment only by pushing
 * a button. These parameters are computed by the host and then processed
 * to create the `GeneratorContext`
 */
export interface EditorParameters {
  /**
   * The ID of the current programming language. This is used
   * by the dictionary module to infer the language configurations.
   */
  readonly languageId: string

  /** The text in the current line in the active editor. */
  readonly currentLineText: string

  /** Current line number in the active editor. */
  readonly currentLineNumber: number

  /**
   * Size of the tabs in the current editor. The amount of spaces
   * equal to the size of the tab.
   */
  readonly editorTabSize: number

  /**
   * Tells if the editor actually inserts tabs (`\t`s) or places
   * spaces instead and emulates the tab.
   */
  readonly tabWhiteSpaceMode: TabWhitespaceKind
}