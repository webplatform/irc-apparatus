module.exports = {
  bot: {
    plugins: []
  },

  irc: {
    server: null,
    port: 6667,
    secure: false,
    password: null,
    nick: null,
    userName: null,
    realName: null,
    channels: [],
    floodProtection: false,
    floodProtectionDelay: 500,
    retryCount: 10
  }
};
