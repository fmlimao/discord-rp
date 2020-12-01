module.exports = function (auth) {
    console.log('auth.roles', auth.roles);

    const menu = [];

    menu.push({
        label: 'Home',
        icon: 'fa-home',
        path: '/',
    });

    menu.push({
        label: 'Dashboard',
        icon: 'fa-tachometer-alt',
        path: '/',
    });

    menu.push({
        label: 'Usuários',
        icon: 'fa-user',
        path: '/users',
    });

    menu.push({
        label: 'Perfil',
        icon: 'fa-address-card',
        path: '/profile',
    });

    menu.push({
        label: 'Clientes',
        icon: 'fa-users',
        path: '/clients',
    });

    menu.push({
        label: 'Propostas',
        icon: 'fa-file-alt',
        path: '/proposals',
    });


    return menu;
};