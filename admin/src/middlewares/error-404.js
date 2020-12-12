module.exports = (req, res, next) => {
    const user = req.cookies.user;
    user.nick = user.nick ? user.nick : user.username;
    return res.render('error-404', {
        user: req.cookies.user
    });
}