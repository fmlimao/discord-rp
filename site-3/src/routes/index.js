module.exports = (req, res, next) => {
    // if (
    //     req.cookies.token
    //     && req.cookies.user
    //     && req.cookies.user.hasGuild
    //     && req.cookies.user.whitelist
    // )
        return res.redirect('/site');

    res.render('index', {
        linkLogin: process.env.OAUTH2_URL,
    });
};
