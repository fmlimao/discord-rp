const MarkdownIt = require('markdown-it');
const MarkdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default;
const path = require('path');
const fs = require('fs');
const striptags = require('striptags');

module.exports = (req, res) => {
    const filePath = path.join(__dirname, '../../rules.md');
    const content = fs.readFileSync(filePath).toString();

    const formattedContent = MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    }).use(MarkdownItTocAndAnchor, {
        anchorClassName: 'header-anchor',
        // anchorLinkSymbolClassName: 'header-anchor',
    }).render(content);

    const headings = formattedContent.split('\n')
        .map(row => {
            const isH = row.match(/^\<h([1-6])\s?\>?/i);
            if (isH) {
                const id = row.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/i);
                return {
                    level: isH[1],
                    content: striptags(row).replace('# ', ''),
                    id: id[2],
                };
            }
        })
        .filter(row => row);

    // console.log('headings', headings);

    const version = formattedContent.split('\n')
        .map(row => {
            const version = row.match(/v([0-9]+)\.([0-9]+)\.([0-9]+)/i);
            if (version) {
                return version[0];
            }
        })
        .filter(row => row)[0];

    // console.log('version', version);

    // res.json({
    //     parsedContent,
    // });

    res.render('rules', {
        content,
        formattedContent,
        headings,
        version,
    });
};
