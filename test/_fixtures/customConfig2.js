module.exports = {
  bot: {
    plugins: ['my-plugin', 'plugin2']
  },
  irc: {
    server: 'irc.freenode.net',
    port: 6697,
    nick: 'testnick',
    realName: 'testrealname',
    channels: ['&anotherChannel'],
    retryCount: 5
  }
};
