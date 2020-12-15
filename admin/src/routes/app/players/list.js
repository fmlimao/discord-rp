const {
    getDiscordGuildMembers,
    generateUserAvatar,
    generateUserRoles,
    sortRoles,
} = require('../../../helpers/discord');

const generateColorHexa = colorInt => {
    return colorInt.toString(16).padStart(6, '0');
};

const inverseColor = srcVal => {
    const valNumerico = parseInt(srcVal, 16);
    const mascara = parseInt('FFFFFF', 16);
    const dest = valNumerico ^ mascara; //Operação XOR
    return dest.toString(16);
};

const hexToRgb = hex => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    return {
        r,
        g,
        b,
    };
};

const rgbToHex = (r, g, b) => {
    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');
    return (r + g + b).padStart(6, '0');
};

const rgbToHsl = (r, g, b) => {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;


    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;



    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
        h,
        s,
        l,
    };
};

const hslToRgb = (h, s, l) => {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;


    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {
        r,
        g,
        b,
    };
};

const sortUserByRole = (a, b, role_id) => {
    const aHasRole = a.rolesIds.indexOf(role_id) !== -1;
    const bHasRole = b.rolesIds.indexOf(role_id) !== -1;

    if (aHasRole && !bHasRole) return -1;
    else if (!aHasRole && bHasRole) return 1;
    else if (aHasRole && bHasRole) {
        if (a.usernameNick < b.usernameNick) return -1;
        else if (a.usernameNick > b.usernameNick) return 1;
        else return 0;
    } else return null;
};

module.exports = async (req, res) => {
    try {
        const members = (await getDiscordGuildMembers(1000))
            .map(member => {
                member.user.avatarUrl = generateUserAvatar(member.user);

                const usernameNick = member.nick ? member.nick : '@' + member.user.username + '#' + member.user.discriminator;

                const rolesIds = member.roles;

                member.roles = generateUserRoles(member.roles, res.locals.guild.roles, role => {
                    const hex = generateColorHexa(role.color);
                    const rgb = hexToRgb(hex);
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

                    let newHue = hsl.h + 180;
                    if (newHue >= 360) newHue %= 360;
                    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
                    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);

                    return {
                        id: role.id,
                        name: role.name,
                        color: hex,
                        complementarColor: newHex,
                        position: role.position,
                    };
                });
                member.roles.sort(sortRoles);

                return {
                    id: member.user.id,
                    username: member.user.username,
                    nick: member.nick,
                    discriminator: member.user.discriminator,
                    usernameNick: usernameNick,
                    avatar: member.user.avatar,
                    avatarUrl: member.user.avatarUrl,
                    roles: member.roles,
                    rolesIds: rolesIds,
                };
            })
            .sort((a, b) => {
                for (let i in res.locals.guild.roles) {
                    const hasRole = sortUserByRole(a, b, res.locals.guild.roles[i].id);
                    if (hasRole !== null) return hasRole;
                }

                if (a.usernameNick < b.usernameNick) return -1;
                else if (a.usernameNick > b.usernameNick) return 1;
                else return 0;
            });

        res.render('app/players/list', {
            members,
            membersJson: JSON.stringify(members),
        });
    } catch (error) {
        res.json({
            error,
        });
    }
};