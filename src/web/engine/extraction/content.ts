import * as protocols from '../protocols';

// ─── Result ────────────────────────────────────────────────────────────── ✣ ─

export interface CommentExtractionResult {
  indentation:  string;
  content:      string;
}

// ─── Extract Current Content ───────────────────────────────────────────── ✣ ─

export function extractCommentContent(
  editorParameters:       protocols.EditorParameters,
  languageConfiguration:  protocols.LanguageCharacterConfigurations,
): CommentExtractionResult | null {

  const regExpStart   = '^(\s*)';
  const commentSign   = encodeRegExp(languageConfiguration.middle);
  const regExpEnd     = ' ─── ((?:[a-zA-Z ]|[0-9][0-9\\.]*|[\\:\\-\\+\\@\\!\\?])+) ─+(?: .+ )?─$';

  const detectionRegExp = new RegExp(regExpStart + commentSign + regExpEnd);

  /** If matched, group 1 is the indentation and group 2 is the content. */
  const matches = editorParameters.currentLineText.match(detectionRegExp);

  if (matches === null)  {
    return null;
  }

  return {
    indentation:  matches[1]!,
    content:      matches[2]!,
  };
}

// ─── Safe Encode Regexp Part ───────────────────────────────────────────── ✣ ─

function encodeRegExp(sequence: string) {
  return sequence.replace(
    /[\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:\-]/g,
    (match: string) => `\\${match}`,
  );
}