module.exports = async (req, res, next) => {
    if (!req.cookies.user) return res.redirect('/auth/get');
    return next();
};