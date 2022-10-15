import * as engine      from '..';
import * as skeleton    from './skeleton';
import * as constants   from '../constants';
import * as validation  from '../validation';
import * as toolkit     from '../toolkit';

// ─── Generate Section Comment ──────────────────────────────────────────── ✣ ─

export const generateSectionComment = skeleton.createCommentGenerationSkeleton({
  contextVerifier:    verifier,
  commentGenerator:   generator,
});

// ─── Verifier ──────────────────────────────────────────────────────────── ✣ ─

function verifier(
  context: engine.concepts.GeneratorContext
): validation.ValidationResult {

  const nameError = validation.validateCommentName(context);
  if (nameError) {
    return nameError;
  }

  const sizeError = validation.validateSectionCommentSize(context);
  if (sizeError) {
    return sizeError;
  }

  return null;
}

// ─── Generator ─────────────────────────────────────────────────────────── ✣ ─

function generator(context: engine.concepts.GeneratorContext): string {
  // // ─── Comment Title ─────────────────────────────────── ✣ ─
  // ◀─▶ A
  //    ◀──▶ B
  //        ◀────────────▶ C
  //                      ◀─────────────────────────────────▶ D
  //                                                         ◀───▶ E

  // A
  const a = context.commentGrammarPrefix;
  // B
  const b = toolkit.lineOfSize(3) + ' ';
  // C
  const c = computeTitle(context) + ' ';
  // d
  const d = toolkit.lineOfSize(
    context.commentBodyAvailableSpace
        - b.length
        - c.length
  );
  // E
  const e = context.ornament.render;

  return a + b + c + d + e;
}

// ─── Title ─────────────────────────────────────────────────────────────── ✣ ─

function computeTitle(context: engine.concepts.GeneratorContext): string {
  if (context.legacyModeIsOn) {
    return context.whitespaceNormalizedInput.toLocaleUpperCase();
  }

  return toolkit.capitalizeSentence(context.whitespaceNormalizedInput);
}