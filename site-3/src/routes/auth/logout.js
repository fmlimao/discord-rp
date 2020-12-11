const { clearAllCookies } = require('../../helpers/cookies');

module.exports = async (req, res) => {
    clearAllCookies(res);
    return res.redirect('/');
};