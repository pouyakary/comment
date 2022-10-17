import * as concepts    from '../concepts';
import * as validation  from '.';

// ─── Validate Comment Size ─────────────────────────────────────────────── ✣ ─

export function validateSectionCommentSize(
  context: concepts.Context
): validation.ValidationResult {

  // // ─── Comment Title ──────────────────────── ✣ ─
  //    ◀──▶ starting part, size = 4
  //                     ◀──▶ ending part, size = at least 4
  //    ◀────────────────────────────────────────▶ available space
  const result = context.whitespaceNormalizedInput.length < (context.commentBodyAvailableSpace) - 8;

  if (result) {
    return null;
  }

  return 'Comment is too long.';
}
