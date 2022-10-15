import * as engine      from '..';
import * as skeleton    from './skeleton';
import * as constants   from '../constants';

// ─── Generate Line Comment ─────────────────────────────────────────────── ✣ ─

export const generateLineComment = skeleton.createCommentGenerationSkeleton({
  contextVerifier:    verifier,
  commentGenerator:   generator,
});

// ─── Verifier ──────────────────────────────────────────────────────────── ✣ ─

function verifier(context: engine.concepts.GeneratorContext): null {
  return null;
}

// ─── Generator ─────────────────────────────────────────────────────────── ✣ ─

function generator(context: engine.concepts.GeneratorContext): string {
  return (
    // Comment Grammar
    context.commentGrammarPrefix +
    // Line
    constants.COMMENT_LINE_CHARACTER.repeat(context.commentBodyAvailableSpace) +
    // Ornament
    context.ornament.render
  );
}
