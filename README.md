
# Comment _for Visual Studio Code_

![](https://vsmarketplacebadge.apphb.com/version/karyfoundation.comment.svg) ![](https://vsmarketplacebadge.apphb.com/installs/karyfoundation.comment.svg)

<img src="https://user-images.githubusercontent.com/2157285/28877787-ace1415e-77b2-11e7-81fa-e4d3d7af50ec.gif" width="600" />

## Are you using KFCS?

If you're coding with [KFCS](https://github.com/karyfoundation/comment/wiki) you most probably use either [Comment IV](https://github.com/karyfoundation/comment) or [Comment 3](https://github.com/karyfoundation/comment-3). The experience on Comment IV has been dramatically improved over time and it's now a very fast experience creating comments, however that requires many switching over applications:

```
cmd + alt  -->  to go to Comment IV
cmd + a    -->  to activate the input box and select all of it's texts
cmd + alt  -->  going back to editor
cmd + v    -->  to paste the comments
```

And this is too much work for a comment. That's why this extension exists. Comment 5 is a complete KFCS experience with intelligence in mind.

In order to reduce the settings time, this extension has a content-aware system, it scans the spacing of your lines start and then understands the real and relative indentations needed for KFCS. It then chooses a comment template between `Section W80`, `Section W65` and `InSection` comments. The language is also understood by the editors environmental settings.

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
── ─────────────────────────────────────────────────── REVERSE SECTION HEADER ─────
──

        ──
        ── ─── INDENTATION LEVEL 2 ─────────────────────────────────────────
        ──

        ──
        ── ──────────────────────────────────── REVERSE LEVEL 2 HEADER ─────
        ──

                ──
                ── INDENTATION LEVEL 3
                ──

                ── • • • • •

        ── ─────────────────────────────────────────────────────────────────

── ────────────────────────────────────────────────────────────────────────────────
```

## How to use?
Comment 5 is content-aware so you don't have to choose your section type of comment. Comment uses `KFCS Section Comment Width 80`, `KFCS Section Comment Width 60` and `KFCS Section InSection Comment` for start of your part and `KFCS Line Comment Width 80`, `KFCS Line Comment Width 60` and `KFCS Separator Comment` for end of your section. What you have to do is to specify if the comment is start or the end of the section.

| Comments      | Keybindings           | Additional Information                                    |
|---------------|-----------------------|-----------------------------------------------------------|
| Flag          | `alt` + `shift` + `y` | You'll have to also give it the index number              |
| Section Header | `alt` + `y`           | Section Comment for Indentation less than 2 and InSection comment for the rest    |
| Reverse Section Start | `alt` + `m` | _same as section comment_ |
| Section End   | `alt` + `l`           | Line Comment for Indentation less than 2 and Separator comment for the rest |

## Whats new?
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

<br />
<a href="http://www.karyfoundation.org/">
    <img src="https://user-images.githubusercontent.com/2157285/28680500-c9ca905a-730b-11e7-99bf-2b249d97c17d.png" width="250"/>
</a>