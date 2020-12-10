module.exports = (req, res, next) => {
    const user = req.cookies.user;
    user.nick = user.nick ? user.nick : user.username;
    res.render('index', {
        user: req.cookies.user
    });
};
