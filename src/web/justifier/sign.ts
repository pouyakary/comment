// Justifier  - A comment justifier exten-
// sion for Visual Studio Code that  just-
// ifies  the  size  of  comments lines to
// under      40       character       for
// better readability.
//
// (C)          2023-present         Pouya
// Kary <kary@gnu.org>
//
// This  program is free software: you can
// redistribute it and/or modify it  under
// the  terms  of  the  GNU General Public
// License as published by the Free  Soft-
// ware  Foundation,  either  version 3 of
// the License, or (at  your  option)  any
// later version.
//
// This program is distributed in the hope
// that it will be useful, but WITHOUT ANY
// WARRANTY;  without even the implied wa-
// rranty of  MERCHANTABILITY  or  FITNESS
// FOR  A  PARTICULAR PURPOSE. See the GNU
// General     Public     License      for
// more details.
//
// You  should have received a copy of the
// GNU General Public License  along  with
// this       program.       If       not,
// see    <https://www.gnu.org/licenses/>.

const oneLineCommentSigns = ["//", "///", "--", "#", ";;", "*", "/**", "/*"];

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Detects The Start Of A Comment ────────────────────────────────────── ✣ ─

export function detectStartOfTheComment(input: string): string | null {
  const sign = detectCommentSign(input);

  if (sign == null) {
    return null;
  }

  const escapedSign = escapeRegExp(sign);
  const regexp = "^(?:\\s*\\n)*([ \\t]*" + escapedSign + "+)";
  const regExp = new RegExp(regexp);
  const result = regExp.exec(input);
  const start = result?.[1] ?? null;

  if (start == null) {
    return null;
  }

  return start + " ";
}

// ─── Detects The Sign Of The Comment ───────────────────────────────────── ✣ ─

function detectCommentSign(line: string): string | null {
  for (const sign of oneLineCommentSigns) {
    if (line.trim().startsWith(sign)) {
      return sign;
    }
  }

  return null;
}