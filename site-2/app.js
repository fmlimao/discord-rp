console.clear();
require('dotenv-safe').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
const utf8 = require('utf8');

const oauth2_url = process.env.OAUTH2_URL;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const bot_token = process.env.BOT_TOKEN;

const guild_id = process.env.GUILD_ID;
const role_whitelist_id = process.env.ROLE_WHITELIST_ID;

const clearAllCookies = (res) => {
  res.clearCookie('token');
  res.clearCookie('guild');
  res.clearCookie('user');
};

const getDiscordTokenData = async (code) => {
  const data = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: 'authorization_code',
    redirect_uri: redirect_uri,
    code: code,
    scope: 'identify email guilds',
  };

  return (await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })).data;
}

const getDiscordUserData = async (req) => {
  return (await axios.get('https://discord.com/api/users/@me', {
    headers: {
      'authorization': `${req.cookies.token.token_type} ${req.cookies.token.access_token}`,
    },
  })).data;
}

const getDiscordUserGuilds = async (req) => {
  return (await axios.get('https://discord.com/api/users/@me/guilds', {
    headers: {
      'authorization': `${req.cookies.token.token_type} ${req.cookies.token.access_token}`,
    },
  })).data;
}

const getDiscordUserGuildMember = async (user_id, guild_id) => {
  return (await axios.get(`https://discord.com/api/guilds/${guild_id}/members/${user_id}`, {
    headers: {
      'authorization': `Bot ${bot_token}`,
    },
  })).data;
}

const generateUserData = async (req) => {
  const auth = {};

  const userData = await getDiscordUserData(req);

  auth.id = userData.id;
  auth.username = userData.username;
  auth.avatar = userData.avatar;
  auth.avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.jpg`;
  auth.email = userData.email;

  const userGuilds = await getDiscordUserGuilds(req);
  const hasGuild = !!userGuilds.filter(guild => guild.id == guild_id).length;
  auth.hasGuild = hasGuild;
  auth.nick = '';
  auth.whitelist = false;

  if (hasGuild) {
    const userGuildMember = await getDiscordUserGuildMember(userData.id, guild_id);
    auth.nick = userGuildMember.nick ? userGuildMember.nick : '';
    auth.whitelist = !!userGuildMember.roles.filter(role_id => role_id == role_whitelist_id).length;
  }

  return auth;
}

const tokenAndGuildVerifyMiddleware = async (req, res, next) => {
  if (
    !req.cookies.token
    || !req.cookies.guild
  ) return res.redirect(oauth2_url);

  return next();
};

const userVerifyMiddleware = async (req, res, next) => {
  if (!req.cookies.user) return res.redirect('/get-auth');
  return next();
};

const guildAndWhitelistVerifyMiddleware = (req, res, next) => {
  if (
    !req.cookies.user.hasGuild
    || !req.cookies.user.whitelist
  ) {
    return res.render('whitelist', { title: 'Whitelist', user: req.cookies.user });
  }

  return next();
};

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/logout', async (req, res) => {
  clearAllCookies(res);
  return res.redirect('/');
});

app.get('/auth/callback', async (req, res) => {
  try {
    const tokenData = await getDiscordTokenData(req.query.code);

    const token = {
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
    };

    const guild = {
      id: tokenData.guild.id,
      name: tokenData.guild.name,
      icon: tokenData.guild.icon,
    };

    res.cookie('token', token);
    res.cookie('guild', guild);

    return res.redirect('/get-auth');
  } catch (error) {
    clearAllCookies(res);
    return res.redirect('/');
  }
});

app.use(tokenAndGuildVerifyMiddleware);

app.get('/get-auth', async (req, res) => {
  try {
    const userData = await generateUserData(req);
    res.cookie('user', userData);

    return res.redirect('/');
  } catch (error) {
    clearAllCookies(res);
    return res.redirect('/');
  }
});

app.use(userVerifyMiddleware);

app.get('/verify-whitelist', (req, res) => {
  clearAllCookies(res);
  return res.redirect('/');
});

app.use(guildAndWhitelistVerifyMiddleware);

app.use((req, res, next) => {
  console.log('req.cookies', req.cookies);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const user = req.cookies.user;
  user.nick = user.nick ? user.nick : user.username;
  // next(createError(404));
  return res.render('error-404', {
    user: req.cookies.user
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
