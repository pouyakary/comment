import * as protocols from '.';

// ─── Generator Protocol ────────────────────────────────────────────────── ✣ ─

export interface CommentGeneratorProtocol {
  generate: (context: protocols.GeneratorContext) => string
}
