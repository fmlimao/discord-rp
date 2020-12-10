module.exports = async (req, res, next) => {
    if (!req.cookies.token) return res.redirect(process.env.OAUTH2_URL);
    return next();
};