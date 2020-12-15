module.exports = (req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;

    const menu = [];

    // Dashboard
    menu.push({
        label: 'Dashboard',
        icon: 'fa fa-dashboard',
        path: '/app/dashboard',
        selected: res.locals.url == '/app/dashboard',
    });

    // // Comandos
    // if (
    //     res.locals.user.isDirector
    //     // || res.locals.user.isDirector
    // ) {
    //     menu.push({
    //         label: 'Comandos',
    //         icon: 'fa fa-dashboard',
    //         path: '/app/commands',
    //         selected: res.locals.url == '/app/commands',
    //     });
    // }

    // Players
    if (
        res.locals.user.isStaff
    ) {
        menu.push({
            label: 'Players',
            icon: 'fa fa-users',
            path: '/app/players',
            selected: res.locals.url == '/app/players',
        });
    }

    res.locals.menu = menu;
    res.locals.menuJson = JSON.stringify(menu);

    next();
};