module.exports = async (req, res, next) => {
    if (
        !req.cookies.token
        || !req.cookies.user
        || !req.cookies.user.hasGuild
        || !req.cookies.user.whitelist
    ) return res.redirect('/');
    return next();
};