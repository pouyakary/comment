import * as protocols   from '../protocols';
import * as concepts    from '../concepts';

// ─── Result ────────────────────────────────────────────────────────────── ✣ ─

export interface CommentExtractionResult {
  indentation:  string;
  content:      string;
}

// ─── Extract Current Content ───────────────────────────────────────────── ✣ ─

export function extractCommentContent(
  editorParameters:   protocols.EditorParameters,
  language:           concepts.Language,
): CommentExtractionResult | null {

  const detectionRegExp = language.wrapCommentDetectionRegExp(
    '─── ((?:[a-zA-Z ]|[0-9][0-9\\.]*|[\\:\\-\\+\\@\\!\\?])+) ─+(?: .+ ─)?'
  );

  console.log(`regexp: '${detectionRegExp.source}'`);


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
