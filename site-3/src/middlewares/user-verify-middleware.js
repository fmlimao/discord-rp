module.exports = async (req, res, next) => {
    if (!req.cookies.user) return res.redirect('/');
    return next();
};