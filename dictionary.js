
//
// ─── LANGUAGES ──────────────────────────────────────────────────────────────────
//

    module.exports = languageName => {
        switch ( languageName ) {
            case 'arendelle':
            case 'cpp':
            case 'csharp':
            case 'glsl':
            case 'groovy':
            case 'haxe':
            case 'java':
            case 'javascript':
            case 'javascriptreact':
            case 'jison':
            case 'json':
            case 'karyscript':
            case 'less':
            case 'objective-c':
            case 'ohm':
            case 'pegjs':
            case 'php':
            case 'processing':
            case 'qml':
            case 'rust':
            case 'scala':
            case 'swift':
            case 'terraform':
                    return {
                        sensitive:  true,
                        chars:      { start: "#", middle: "#", end: "#" },
                    }
            case 'typescript':
            case 'typescriptreact':
            case 'uno':
                return {
                    sensitive:  false,
                    chars:      { start: "//", middle: "//", end: "//" },
                }

            case 'fsharp':
            case 'go':
            case 'pageman':
            case 'stylus':
            case 'yuml':
                return {
                    sensitive:  true,
                    chars:      { start: "//", middle: "//", end: "//" },
                }

            case 'bash':
            case 'fish':
            case 'make':
            case 'makefile':
            case 'nearley':
            case 'perl':
            case 'powershell':
            case 'r':
            case 'ruby':
            case 'shell':
            case 'shellscript':
                return {
                    sensitive:  false,
                    chars:      { start: "#", middle: "#", end: "#" },
                }

            case 'coffeescript':
            case 'julia':
            case 'python':
            case 'nix':
            case 'yml':
            case 'yaml':
                return {
                    sensitive:  true,
                    chars:      { start: "#", middle: "#", end: "#" },
                }


            case 'latex':
            case 'matlab':
            case 'octave':
            case 'tex':
                return {
                    sensitive:  false,
                    chars:      { start: "%", middle: "%", end: "%" },
                }

            case 'elm':
            case 'haskell':
            case 'purescript':
                return {
                    sensitive:  true,
                    chars:      { start: "--", middle: "--", end: "--" },
                }

            case 'lua':
            case 'sql':
                return {
                    sensitive:  false,
                    chars:      { start: "--", middle: "--", end: "--" },
                }

            case 'clojure':
            case 'lisp':
            case 'racket':
            case 'scheme':
                return {
                    sensitive:  false,
                    chars:      { start: ";;", middle: ";;", end: ";;" },
                }

            case 'bat':
                return {
                    sensitive:  false,
                    chars:      { start: "::", middle: "::", end: "::" },
                }

            case 'vb':
                return {
                    sensitive:  false,
                    chars:      { start: "'", middle: "'", end: "'" },
                }

            case "css":
            case "c":
                return {
                    sensitive:  false,
                    chars:      { start: "/*", middle: " *", end: " */" },
                }

            case "html":
            case "xml":
            case "xhtml":
            case "us":
            case "xaml":
            case "plist":
                return {
                    sensitive:  false,
                    chars:      { start: "<!--", middle: "  --", end: "  -->" },
                }

            case 'plaintext':
                return {
                    sensitive:  false,
                    chars:      { start: "--", middle: "--", end: "--" },
                }

            default:
                return null
        }
    }

// ────────────────────────────────────────────────────────────────────────────────
