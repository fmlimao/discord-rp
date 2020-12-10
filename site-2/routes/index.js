var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const user = req.cookies.user;
  user.nick = user.nick ? user.nick : user.username;
  res.render('index', {
    user: req.cookies.user
  });
});

module.exports = router;
