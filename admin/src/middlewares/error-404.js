module.exports = (req, res, next) => {
    if (res.locals.token) return res.render('app/error-404');
    else return res.render('error-404');
}