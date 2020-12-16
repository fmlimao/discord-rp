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

    // Players
    // if (
    //     res.locals.user.isStaff
    // ) {
    //     menu.push({
    //         label: 'Players',
    //         icon: 'fa fa-users',
    //         path: '/app/players',
    //         selected: res.locals.url == '/app/players',
    //     });
    // }

    // Regras
    if (
        res.locals.user.isDirector
    ) {
        menu.push({
            label: 'Regras',
            icon: 'fa fa-book',
            path: '/app/rules',
            selected: res.locals.url == '/app/rules',
        });
    }

    res.locals.menu = menu;
    res.locals.menuJson = JSON.stringify(menu);

    const pagesByRoles = {};
    pagesByRoles['/app/players'] = ['isStaff'];
    pagesByRoles['/app/rules'] = ['isDirector'];

    if (typeof pagesByRoles[res.locals.url] !== 'undefined') {
        let canAccess = false;

        for(let i in pagesByRoles[res.locals.url]) {
            const role = pagesByRoles[res.locals.url][i];
            if (res.locals.user[role]) {
                canAccess = true;
            }
        }

        if (!canAccess) {
            return res.render('app/unauthorized');
        }
    }


    next();
};