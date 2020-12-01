const utf8 = require("utf8");
const querystring = require("querystring");

function parseJwt(token) {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
}

module.exports = (req, res, next) => {
    if (!req.cookies.systemLogin) {
        return res.redirect('/login');
    }

    const token = req.cookies.systemLogin;
    const payload = parseJwt(token);

    payload.username = utf8.decode(payload.username);
    payload.nickname = utf8.decode(payload.nickname);

    if (payload.roles != '') {
        payload.roles = JSON.parse(payload.roles);
        payload.roles.sort((a, b) => {
            if (a.rawPosition < b.rawPosition) return 1;
            if (a.rawPosition > b.rawPosition) return -1;
            return 0;
        });
    }

    payload.displayName = payload.username;
    if (payload.nickname) payload.displayName = payload.nickname;

    req.token = token;
    req.auth = payload;

    // req.auth.menu = require('../helpers/get-role-menu')(req.auth);

    next();
};
