import * as constants from '../constants';

// ─── Create A Separator ────────────────────────────────────────────────── ✣ ─

export function lineOfSize(size: number) {
  return constants.COMMENT_LINE_CHARACTER.repeat(size);
}
