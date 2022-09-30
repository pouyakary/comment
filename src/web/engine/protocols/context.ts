import * as protocols from '.';

// ─── Comment Environment Context ───────────────────────────────────────── ✣ ─

export interface GeneratorContext {
  readonly indentationSize:   number
  readonly line:              number
  readonly legacyMode:        number
  readonly ornament:          string
  readonly languageConfig:    protocols.LanguageConfigurations
}
