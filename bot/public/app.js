
// var socket = io();

// socket.on('connect', () => {
//     App.init();
// });

// socket.on('get-guilds', ret => {
//     console.log('get-guilds', ret);
//     App.guilds = ret.guilds;
// });

// socket.on('get-guild-roles', ret => {
//     console.log('get-guild-roles', ret);
//     App.guild = ret.guild;
//     App.roles = ret.roles;
// });

// // ------------------------------------------------------

var route = new FMRoute();

route.get('/', function (vars, next) {
    console.log('/');

    App.currentPage = 'home';

    // route.go('/guilds');

    next();
});

route.get('/guilds', function (vars, next) {
    console.log('/guilds');

    App.currentPage = 'guilds';

    // socket.emit('get-guilds', null);

    next();
});

route.get('/guilds/:id/roles', function (vars, next) {
    console.log('/guilds/:id/roles');

    App.currentPage = 'guilds-id-roles';

    // socket.emit('get-guild-roles', {
    //     guild_id: vars.id,
    // });

    next();
});

// ------------------------------------------------------

var App = new Vue({
    el: '#AppVue',
    data: {
        currentPage: 'home',
        server: {
            started: false,
            loading: false,
            messages: [],
        },
//         guilds: [],
//         guild: {},
//         roles: [],
//         permissions: [
//             'ADMINISTRATOR',
//             'VIEW_AUDIT_LOG',
//             'VIEW_GUILD_INSIGHTS',
//             'MANAGE_GUILD',
//             'MANAGE_ROLES',
//             'MANAGE_CHANNELS',
//             'KICK_MEMBERS',
//             'BAN_MEMBERS',
//             'CREATE_INSTANT_INVITE',
//             'CHANGE_NICKNAME',
//             'MANAGE_NICKNAMES',
//             'MANAGE_EMOJIS',
//             'MANAGE_WEBHOOKS',
//             'VIEW_CHANNEL',
//             'SEND_MESSAGES',
//             'SEND_TTS_MESSAGES',
//             'MANAGE_MESSAGES',
//             'EMBED_LINKS',
//             'ATTACH_FILES',
//             'READ_MESSAGE_HISTORY',
//             'MENTION_EVERYONE',
//             'USE_EXTERNAL_EMOJIS',
//             'ADD_REACTIONS',
//             'CONNECT',
//             'SPEAK',
//             'STREAM',
//             'MUTE_MEMBERS',
//             'DEAFEN_MEMBERS',
//             'MOVE_MEMBERS',
//             'USE_VAD',
//             'PRIORITY_SPEAKER',
//         ],
    },
    methods: {

        init: function () {
            App.routes();
        },

        routes: function () {
            route.run();
        },

        updateServer: function () {
            App.server.started = true;
            App.server.loading = true;
            App.server.messages.push('Servidor atuaizado com sucesso!');
        },

//         updateRolePermission: function (role, permission) {

//             socket.emit('set-guild-role-permission', {
//                 guild_id: App.guild.guild_id,
//                 role_id: role.role_id,
//                 permission: permission,
//                 value: !role[permission],
//             });
//         },

    },
});

App.init();
