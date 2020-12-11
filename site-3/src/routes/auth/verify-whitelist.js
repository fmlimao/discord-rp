const { clearAllCookies } = require('../../helpers/cookies');

module.exports = (req, res) => {
    clearAllCookies(res);
    return res.redirect('/');
};