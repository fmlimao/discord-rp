module.exports = async (req, res) => {
    if (req.cookies.token) return res.redirect('/app');
    return res.redirect(process.env.OAUTH2_URL);
};