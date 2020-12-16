const MarkdownIt = require('markdown-it');
const path = require('path');
const fs = require('fs');
const md = new MarkdownIt();

module.exports = (req, res) => {
    const filePath = path.join(__dirname, '../../rules.md');
    const content = fs.readFileSync(filePath).toString();
    const formattedContent = md.render(content);

    // res.json({
    //     filePath,
    //     content,
    //     formattedContent,
    // });

    res.render('rules', {
        content: content,
        formattedContent: formattedContent,
    });
};
