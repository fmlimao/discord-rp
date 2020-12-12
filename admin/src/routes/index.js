module.exports = (req, res) => {
    res.render('index', {
        hasToken: !!req.cookies.token,
    });
};