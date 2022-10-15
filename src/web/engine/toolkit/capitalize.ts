// ─── Capitalize Text ───────────────────────────────────────────────────── ✣ ─

export function capitalizeSentence(text: string) {
  const words = text.toLowerCase().trim().split(/\s+/);
  const allCapsWords = words.map( word => {
      let copy  = [...word];
      copy[0]   = copy[0].toUpperCase();
      return copy.join('');
  });
  return allCapsWords.join(' ');
}
