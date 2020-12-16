// const MarkdownIt = require('markdown-it');
const path = require('path');
const fs = require('fs');
// const md = new MarkdownIt();
const {markdown} = require('markdown');

module.exports = (req, res) => {
    const filePath = path.join(__dirname, '../../rules.md');
    const content = fs.readFileSync(filePath).toString();
    // const formattedContent = md.render(content);
    const formattedContent = markdown.toHTML(content);
    const parsedContent = markdown.parse(content);
    console.log('parsedContent', parsedContent);

    // res.json({
    //     parsedContent,
    // });

    res.render('rules', {
        content: content,
        formattedContent: formattedContent,
    });
};
