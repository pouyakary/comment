// ─── Ornament ──────────────────────────────────────────────────────────── ✣ ─

export class Ornament {
  #decoration: string;

  constructor(decoration: string) {
    this.#decoration = decoration;
  }

  get render(): string {
    if (this.#decoration === '') {
      return '';
    }
    return ` ${this.#decoration} ─`;
  }

  get size(): number {
    if (this.#decoration === '') {
      return 0;
    }
    return 3 + this.#decoration.length;
  }
}