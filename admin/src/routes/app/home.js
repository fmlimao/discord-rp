module.exports = (req, res) => {
    console.log('req.user', req.user);

    res.render('app/home', {
        user: req.user,
        guild: req.guild,
        userJson: JSON.stringify(req.user),
        guildJson: JSON.stringify(req.guild),
    });
};