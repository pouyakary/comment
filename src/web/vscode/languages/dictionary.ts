import * as engine from "../../engine";

// ─── Load Language Settings ────────────────────────────────────────────── ✣ ─

export function loadLanguageSettings(
  languageId: string,
): engine.protocols.LanguageConfigurations | null {
  switch (languageId) {
    case "arendelle":
    case "c":
    case "cpp":
    case "csharp":
    case "dart":
    case "glsl":
    case "groovy":
    case "haxe":
    case "java":
    case "javascript":
    case "javascriptreact":
    case "jison":
    case "json":
    case "jsonc":
    case "karyscript":
    case "less":
    case "objective-c":
    case "ohm":
    case "pegjs":
    case "php":
    case "processing":
    case "qml":
    case "scala":
    case "solidity":
    case "swift":
    case "typescript":
    case "typescriptreact":
    case "uno":
    case "v":
    case "vala":
    case "zig":
      return {
        sensitive: false,
        commentGrammar: "//",
      };

    case "fsharp":
    case "go":
    case "pageman":
    case "peggy":
    case "pestfile":
    case "pine":
    case "pinescript":
    case "rust":
    case "stylus":
    case "yuml":
    case "scss":
      return {
        sensitive: true,
        commentGrammar: "//",
      };

    case "bash":
    case "dockerfile":
    case "fish":
    case "make":
    case "makefile":
    case "nearley":
    case "perl":
    case "powershell":
    case "r":
    case "rego":
    case "ruby":
    case "shell":
    case "shellscript":
    case "terraform":
      return {
        sensitive: false,
        commentGrammar: "#",
      };

    case "coffeescript":
    case "julia":
    case "python":
    case "nix":
    case "yml":
    case "yaml":
      return {
        sensitive: true,
        commentGrammar: "#",
      };

    case "latex":
    case "matlab":
    case "octave":
    case "tex":
      return {
        sensitive: false,
        commentGrammar: "%",
      };

    case "elm":
    case "haskell":
    case "purescript":
      return {
        sensitive: true,
        commentGrammar: "--",
      };

    case "lua":
    case "sql":
      return {
        sensitive: false,
        commentGrammar: "--",
      };

    case "clojure":
    case "lisp":
    case "racket":
    case "scheme":
    case "wast":
    case "wat":
      return {
        sensitive: false,
        commentGrammar: ";;",
      };

    case "bat":
      return {
        sensitive: false,
        commentGrammar: "::",
      };

    case "vb":
    case "vbs":
    case "asp":
      return {
        sensitive: false,
        commentGrammar: "'",
      };

    case "css":
    case "c":
      return {
        sensitive: false,
        commentGrammar: ["/*", "*/"],
      };

    case "html":
    case "xml":
    case "xhtml":
    case "us":
    case "xaml":
    case "plist":
      return {
        sensitive: false,
        commentGrammar: ["<!--", "-->"],
      };

    case "plaintext":
      return {
        sensitive: false,
        commentGrammar: "--",
      };

    default:
      return null;
  }
}
