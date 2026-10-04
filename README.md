# Comment 6 ✨

Comment 6 is a way to decorate your code with titles and separator lines to organize the portions of a file. I have always had a really hard time to keep track of where a function starts and where it ends. While there are millions of ways to tackle the problem, I simply wanted to have what I had in notebooks: good old lines.

With Comment 6 you can simply create these headings:

![Screen recording of comment generation in Comment 6](https://user-images.githubusercontent.com/2157285/196059184-79542059-88da-45ff-a7a5-87cd804939bf.gif)

And edit them whenever you want:

![Screen recording that shows the editing of a comment in Comment](https://user-images.githubusercontent.com/2157285/196059190-7adef113-05ad-4727-bbc2-dd84a860c146.gif)

<br>

> **🧨 LOOKING FOR THE LEGACY VERSION?** <br>
> Comment 6 is a fully rewritten version. Every line of it is fully brand new. If you wish, you can download the last version of Comment V from [it's GitHub releases](https://github.com/pouyakary/comment/releases/tag/v11.2.0).

<br>

## Comment Justification

![](https://github.com/pouyakary/vscode-comment-justifier/assets/2157285/92d71a5e-b281-4ffb-94e9-fe63940dfdd8)

You can now justify your comments with the all new Comment 7! With this new experimental feature, you can justify your comments, with a markdown aware justification engine designed for readability of your codes.

## Notes 💡

- **Indentation Matters** &mdash; The way comment works is that you pick an empty line and indent as far as you wish your comment is going to be indented. You then start typing the comment and then use the menu or keybindings to generate the comment. The size and indentation of your resulting comment is determined by that indentation.

- **Only Use These Comments To Create Logical Parts In Your Codes** &mdash; Try to separate, types, functions, classes, the parts of the classes. The More organized you are the better.

- **Adopt The Clarity Style To Your Codes** &mdash; Try to have files that are minimal as possible. Have one class per file if you can. When a file move to more than a few hundred lines try to break it into different files. Try to write the best code you can. It always pays the efforts.

## Minimap Support

![](https://github.com/user-attachments/assets/1504b68b-fb5e-4067-b402-08652bc9b4b4)

After championing for [Xcode Style Minimap Headers](https://github.com/microsoft/vscode/pull/190759) and getting it, I had the honor to contribute [Custom Minimap Section Header Marker](https://github.com/microsoft/vscode/pull/210271) rules, specifically to support Comment 6's Comments. Just copy and paste this to your settings.json and have fun!

```json
{
  "editor.minimap.markSectionHeaderRegex": "(\\/\\* )?─── (?<label>[^─]+) ─+(?<separator> . ─)?( \\*\\/)?$"
}
```

## Keybindings

| Comments                      | Keybindings                  |
| ----------------------------- | ---------------------------- |
| 🔧 Creating Title Comment     | `alt` + `y`                  |
| 🔨 Creating Separator Comment | `alt` + `l`                  |
| 🧨 Editing Title Comment      | `ctrl` + `alt` + `cmd` + `y` |

> **NOTE 💡** <br> These keybindings are chosen such that they are both easy to use within QWERTY and Dvorak layouts.
