module.exports = (req, res, next) => {
    if (
        !req.cookies.user.hasGuild
        || !req.cookies.user.whitelist
    ) {
        return res.redirect('/');
        // return res.render('whitelist', { title: 'Whitelist', user: req.cookies.user });
    }

    return next();
};