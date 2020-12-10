module.exports.clearAllCookies = (res) => {
    res.clearCookie('token');
    res.clearCookie('guild');
    res.clearCookie('user');
};