import * as concepts from '.';

// ─── Ornament ──────────────────────────────────────────────────────────── ✣ ─

export class Ornament {
  #decoration:                    string;
  #onlyRenderOrnamentInRootLevel: boolean;

  constructor(decoration: string, onlyRenderOrnamentInRootLevel: boolean) {
    this.#decoration                    = decoration;
    this.#onlyRenderOrnamentInRootLevel = onlyRenderOrnamentInRootLevel;
  }

  #shouldNotRender(indentation: concepts.Indentation) {
    return (this.#onlyRenderOrnamentInRootLevel && indentation.isNotRoot)
      || (this.#decoration === '');
  }

  render(indentation: concepts.Indentation): string {
    if (this.#shouldNotRender(indentation)) {
      return '';
    }
    return ` ${this.#decoration} ─`;
  }

  size(indentation: concepts.Indentation): number {
    if (this.#shouldNotRender(indentation)) {
      return 0;
    }
    return 3 + this.#decoration.length;
  }
}