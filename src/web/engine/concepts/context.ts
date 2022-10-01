import * as protocols from '../protocols';
import * as concepts  from '.';

// ─── Comment Environment Context ───────────────────────────────────────── ✣ ─

/**
 * Generator context is the computed settings that is
 * passed to the comment generator.
 */
export class GeneratorContext {
  readonly indentation:     concepts.Indentation;
  readonly languageConfig:  protocols.LanguageConfigurations;
  readonly userSettings:    protocols.UserSettings;
  readonly editorSettings:  protocols.EditorParameters;

  constructor(
    indentation:      concepts.Indentation,
    languageConfig:   protocols.LanguageConfigurations,
    userSettings:     protocols.UserSettings,
    editorSettings:   protocols.EditorParameters
  ) {
    this.indentation      = indentation;
    this.languageConfig   = languageConfig;
    this.userSettings     = userSettings;
    this.editorSettings   = editorSettings;
  }
}
