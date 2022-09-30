// ─── Tab Kind ──────────────────────────────────────────────────────────── ✣ ─

export enum TabWhitespaceKind {
  tab, space
}

// ─── Environment Parameters ────────────────────────────────────────────── ✣ ─

export interface EnvironmentParameters {
  editorTabSize:            number
  editorInsertSpaceOrTab:   TabWhitespaceKind
  languageId:               string
  currentLineText:          string
  currentLineNumber:        number
}