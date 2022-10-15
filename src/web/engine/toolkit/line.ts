import * as constants from '../constants';

// ─── Create A Line ─────────────────────────────────────────────────────── ✣ ─

export function lineOfSize(size: number) {
  return constants.COMMENT_LINE_CHARACTER.repeat(size);
}
