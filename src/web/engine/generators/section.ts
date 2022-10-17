import * as engine      from '..';
import * as skeleton    from './skeleton';
import * as validation  from '../validation';
import * as toolkit     from '../toolkit';

// ─── Generate Section Comment ──────────────────────────────────────────── ✣ ─

export const generateSectionComment = skeleton.createCommentGenerationSkeleton({
  contextVerifier:    verifier,
  commentGenerator:   sectionGenerator,
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

function sectionGenerator(context: engine.concepts.GeneratorContext): string {
  // // ─── Comment Title ─────────────────────────────────── ✣ ─
  //    ◀──▶ B
  //        ◀────────────▶ C
  //                      ◀─────────────────────────────────▶ D
  //                                                         ◀───▶ E


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

  return b + c + d + e;
}

// ─── Title ─────────────────────────────────────────────────────────────── ✣ ─

function computeTitle(context: engine.concepts.GeneratorContext): string {
  return toolkit.capitalizeSentence(context.whitespaceNormalizedInput);
}
