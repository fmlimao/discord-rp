module.exports.clearAllCookies = (req, res) => {
    for (let i in req.cookies) {
        res.clearCookie(i);
    }
};