module.exports = async (req, res, next) => {
    if (
        !res.locals.token
        || !res.locals.user
        || !res.locals.guild

    ) {
        return res.redirect('/auth/logout');
    }

    next();
};