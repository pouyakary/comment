import * as engine      from '..';
import * as skeleton    from './skeleton';
import * as validation  from '../validation';
import * as toolkit     from '../toolkit';

// ─── Generate Title Comment ──────────────────────────────────────────── ✣ ─

export const generateTitleComment = skeleton.createCommentGenerationSkeleton({
  contextVerifier:    verifier,
  commentGenerator:   titleGenerator,
});

// ─── Verifier ──────────────────────────────────────────────────────────── ✣ ─

function verifier(
  context: engine.concepts.Context
): validation.ValidationResult {

  const nameError = validation.validateCommentName(context);
  if (nameError) {
    return nameError;
  }

  const sizeError = validation.validateTitleCommentSize(context);
  if (sizeError) {
    return sizeError;
  }

  return null;
}

// ─── Generator ─────────────────────────────────────────────────────────── ✣ ─

function titleGenerator(context: engine.concepts.Context): string {
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
  const e = context.ornament.render(context.indentation);

  return b + c + d + e;
}

// ─── Title ─────────────────────────────────────────────────────────────── ✣ ─

function computeTitle(context: engine.concepts.Context): string {
  return toolkit.capitalizeSentence(context.whitespaceNormalizedInput);
}
