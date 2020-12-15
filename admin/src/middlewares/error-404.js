module.exports = (req, res, next) => {
    if (res.locals.token && res.locals.url.indexOf('/app') == 0) return res.render('app/error-404');
    else return res.render('error-404');
}