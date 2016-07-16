
# Comment _for Visual Studio Code_

### Section Comment
![](http://www.karyfoundation.org/media-server/comment-vscode/screen.gif)

### Flag comment
![](https://cloud.githubusercontent.com/assets/2157285/16894346/850c6090-4b68-11e6-8a52-ad2be0d9efa0.gif)

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

<img src="http://www.karyfoundation.org/media-server/comment-vscode/indentation.png" width="600" />

## How to use?
Comment 5 is content-aware so you don't have to choose your section type of comment. Comment uses `KFCS Section Comment Width 80`, `KFCS Section Comment Width 60` and `KFCS Section InSection Comment` for start of your part and `KFCS Line Comment Width 80`, `KFCS Line Comment Width 60` and `KFCS Separator Comment` for end of your section. What you have to do is to specify if the comment is start or the end of the section.

| Comments      | Keybindings           | Additional Information                                    |
|---------------|-----------------------|-----------------------------------------------------------|
| Flag          | `alt` + `shift` + `y` | You'll have to also give it the index number              |
| Section Start | `alt` + `y`           | It will generate Section Comment or InSection Comment     |
| Section End   | `alt` + `l`           | It will generate Line Comment or Separator                |

<br />
<a href="http://www.karyfoundation.org/">
    <img src="http://www.karyfoundation.org/foundation/logo/github-full-horse.png" width="250"/>
</a>