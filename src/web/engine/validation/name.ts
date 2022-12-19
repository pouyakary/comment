import * as concepts    from '../concepts';
import * as validation  from '.';

// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

export const nameFormat =
  /^\s*(\p{L}|[ 0-9\.:\-+@!\?])+\s*$/ui;

// ─── Error Message ─────────────────────────────────────────────────────── ✣ ─

export const nameValidationErrorMessage =
  `Comment text must only contain: Basic Alphabet (a-zA-Z), digits(0-9), :, -, +, @, ?, and !`;

// ─── Validate ──────────────────────────────────────────────────────────── ✣ ─

export function validateCommentName(
  context: concepts.Context
): validation.ValidationResult {

  if (/^\s*$/.test(context.whitespaceNormalizedInput)) {
    return `Comment is empty.`;
  }

  const regexpTest = nameFormat.test(context.whitespaceNormalizedInput);

  if (regexpTest) {
    return null;
  }

  return nameValidationErrorMessage;
}
