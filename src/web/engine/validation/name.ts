import * as concepts    from '../concepts';
import * as validation  from '.';

// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

const nameFormat =
  /^\s*([a-z ]|[0-9][0-9\.]*|[\:\-\+\@\!\?])+\s*$/i;

// ─── Validate ──────────────────────────────────────────────────────────── ✣ ─

export function validateCommentName(
  context: concepts.GeneratorContext
): validation.ValidationResult {

  if (/^\s*$/.test(context.whitespaceNormalizedInput)) {
    return `Comment is empty.`;
  }

  const regexpTest = nameFormat.test(context.whitespaceNormalizedInput);

  if (regexpTest) {
    return null;
  }

  return `Comment text must only contain: basic alphabet, numbers, :, -, +, @, ?, and !. Other formats are not allowed.`;
}
