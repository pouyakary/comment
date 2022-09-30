// ─── Language Dictionary ───────────────────────────────────────────────── ✣ ─

export interface LanguageDictionary {
  readonly [LanguageIdentifier: string]:  LanguageConfigurations
}

// ─── Language Configurations ───────────────────────────────────────────── ✣ ─

export interface LanguageConfigurations {
  readonly sensitive:   boolean,
  readonly chars:       LanguageCharacterConfigurations,
}

// ─── Language Character Configurations ─────────────────────────────────── ✣ ─

export interface LanguageCharacterConfigurations {
  readonly start:   string,
  readonly middle:  string,
  readonly end:     string
}
