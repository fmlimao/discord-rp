module.exports = (req, res, next) => {
    const user = req.cookies.user;
    // user.nick = user.nick ? user.nick : user.username;
    res.json({
        query: req.query,
        params: req.params,
        body: req.body,
    });
};
