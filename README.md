
# Comment 5 _for Visual Studio Code_

If you're coding with [KFCS](https://github.com/karyfoundation/comment/wiki) you most probably use either [Comment IV](https://github.com/karyfoundation/comment) or [Comment 3](https://github.com/karyfoundation/comment-3). The experience on Comment IV has been dramatically improved over time and it's now a very fast experience creating comments, however that requires many switching over applications:

```
cmd + alt --> to go to Comment IV
cmd + a   --> to activate the input box and select all of it's texts
cmd + alt --> going back to editor
cmd + v   --> to paste the comments
```

And this is too much work for a comment. That's why this extension exists. You may just type your comment in a line you want to commentify and then use `⌘+5` to make it a comment. 

In order to reduce the settings time, this extension has a content-aware system, it scans the spacing of your lines start and then understands the real and relative indentations needed for KFCS. It then chooses a comment template between `Section W80`, `Section W65` and `InSection` comments. The language is also understood by the editors environmental settings.