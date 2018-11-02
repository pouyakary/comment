
# Comment V for Visual Studio Code

<img src="https://user-images.githubusercontent.com/2157285/28877787-ace1415e-77b2-11e7-81fa-e4d3d7af50ec.gif" width="600" />

## What is this?

Comment V is a [Kary Comments](https://coding.standards.kary.us/comments) Generation Tool. Kary Comments are a part of the [Kary Coding Standards](https://coding.standards.kary.us) designed to bring richer layouts to the code. These comments are designed to work inside of that specifcitaion and with their own respective rules. So if you don't know them please read these articles before dowloading this extension.

- [Overview of Kary Coding Standards](https://coding.standards.kary.us/)
- [Introduction to Kary Comments](https://coding.standards.kary.us/comments/introduction)
- [Sectioning Code](https://coding.standards.kary.us/comments/sectioning)
- [Comments Reference](https://coding.standards.kary.us/comments/reference)

## Supported Comments

```

──
── ──────────────────────────────────────────────── I ──────────
──   :::::: F L A G : :  :   :    :     :        :          :
── ──────────────────────────────────────────────────────────
──

──
── ─── INDENTATION LEVEL 1 ────────────────────────────────────────────────────────
──

──
── ─────────────────────────────────────────────────── LEVEL 1 ENDING COMMENT ─────
──

        ──
        ── ─── INDENTATION LEVEL 2 ─────────────────────────────────────────
        ──

        ──
        ── ──────────────────────────────────── LEVEL 2 ENDING COMMENT ─────
        ──

                ──
                ── INDENTATION LEVEL 3
                ──

                ── • • • • •

        ── ─────────────────────────────────────────────────────────────────

── ────────────────────────────────────────────────────────────────────────────────
```

## How to use?
Comment V is content-aware so you don't have to choose your section type of comment. Comment uses `Kary Section Comment Width 80`, `Kary Section Comment Width 60` and `Kary Section InSection Comment` for start of your part and `Kary Line Comment Width 80`, `Kary Line Comment Width 60` and `Kary Separator Comment` for end of your section. What you have to do is to specify if the comment is start or the end of the section.

| Comments              | Keybindings           | Additional Information                                                            |
|-----------------------|-----------------------|-----------------------------------------------------------------------------------|
| Flag                  | `alt` + `shift` + `y` | You'll have to also give it the index number                                      |
| Section Header        | `alt` + `y`           | Section Comment for Indentation less than 2 and InSection comment for the rest    |
| Reverse Section Start | `alt` + `m`           | _same as section comment_                                                         |
| Section End           | `alt` + `l`           | Line Comment for Indentation less than 2 and Separator comment for the rest       |

> __NOTE__ <br> These keybindings are chosen such that they are both easy to use within QWERTY and Dvorak layouts.

## Whats new?
- **7.0.1** &mdash; nix language added by [@worldofspace](https://github.com/worldofpeace). (sorry for the late release...)
- **7.0.0** &mdash; This is a big release. The engine is now tailored to be more flexible and generate really better comments for Python and similar indentation-sensative languages.
- **6.1.0** &mdash; A problem with Line comments regarding the spacings was fixed and also based on [a request](https://github.com/pmkary/comment-vscode/issues/5) six new characters are now accepted on the comment text: `-`, `+`, `:`, `@`, `?`, and `!`
- **6.0.0** &mdash; After a lot of requests... It now supports Multi line comments! So languages like C, CSS, HTML, XML... are all now supported!
- **5.0.1** &mdash; GLSL Language Support Added.
- **5.0.0** &mdash; Reverse Section Comments are now supported.
- **4.0.6** &mdash; SQL language is now supported.
- **4.0.5** &mdash; Jison Language is now supported.
- **4.0.4** &mdash; yUML language is now supported.
- **4.0.3** &mdash; Nearley.js language is now supported.
- **4.0.2** &mdash; PEG.js language is now supported.
- **4.0.1** &mdash; Supporting Uno and Fish languages.
- **4.0.0** &mdash; Now having the awesome context menus.
- **3.0.10** &mdash; Line comment improvements.
- **3.0.7** &mdash; YAML is now supported.
