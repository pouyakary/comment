import * as protocols from '../protocols';

// ─── Line Comment ──────────────────────────────────────────────────────── ✣ ─

export class LineComment implements protocols.CommentGeneratorProtocol {
  public generate (context: protocols.GeneratorContext) {
    return "";
  }
}