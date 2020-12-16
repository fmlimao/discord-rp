module.exports = (req, res) => {
    // console.log('res.locals.token', !!res.locals.token);
    // console.log('res.locals.user', !!res.locals.user);
    // console.log('res.locals.guild', !!res.locals.guild);
    aa();
    res.render('index', {
        hasToken: !!res.locals.token,
    });
};