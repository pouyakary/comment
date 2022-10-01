// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

const nameFormat =
  /^\s*([a-z ]|[0-9][0-9\.]*|[\:\-\+\@\!\?])+\s*$/i;

// ─── Validate ──────────────────────────────────────────────────────────── ✣ ─

export function validateCommentName(name: string) {
  return nameFormat.test(name);
}
