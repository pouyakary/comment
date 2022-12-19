import * as protocols   from '../protocols';
import * as concepts    from '../concepts';

// ─── Result ────────────────────────────────────────────────────────────── ✣ ─

export interface CommentExtractionResult {
  indentation:  string;
  content:      string;
  ornament:     string;
}

// ─── Extract Current Content ───────────────────────────────────────────── ✣ ─

export function extractCommentContent(
  editorParameters:   protocols.EditorParameters,
  language:           concepts.Language,
): CommentExtractionResult | null {

  const detectionRegExp = language.wrapCommentDetectionRegExp(
    '─── ((?:\\p{L}|[ 0-9\\.:\\-+@!\\?])+) ─+((?: .+ )?)─'
    //   ^ capture 2:                         ^ capture 3:
    //     the content                        the ornament
  );

  /**
   * If matched, group 1 is the indentation and
   * group 2 is the content and group 3 is the ornament.
   */
  const matches = editorParameters.currentLineText.match(detectionRegExp);

  if (matches === null)  {
    return null;
  }

  return {
    indentation:  matches[1]!,
    content:      matches[2]!,
    ornament:     matches[3]!.trim(),
  };
}
