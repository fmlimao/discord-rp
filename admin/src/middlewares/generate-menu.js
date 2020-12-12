module.exports = (req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;

    const menu = [];

    // Dashboard
    menu.push({
        label: 'Dashboard',
        path: '/app/dashboard',
        selected: res.locals.url == '/app/dashboard',
    });

    // Comandos
    if (
        res.locals.user.isDirector
        // || res.locals.user.isDirector
    ) {
        menu.push({
            label: 'Comandos',
            path: '/app/commands',
            selected: res.locals.url == '/app/commands',
        });
    }

    // Players
    if (
        res.locals.user.isStaff
    ) {
        menu.push({
            label: 'Players',
            path: '/app/players',
            selected: res.locals.url == '/app/players',
        });
    }

    res.locals.menu = menu;
    res.locals.menuJson = JSON.stringify(menu);

    next();
};