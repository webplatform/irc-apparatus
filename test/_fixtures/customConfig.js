module.exports = {
  bot: {
    plugins: ['plugin1', 'plugin2']
  },
  irc: {
    server: 'irc.freenode.net',
    port: 6697,
    secure: true,
    nick: 'testnick',
    userName: 'testusername',
    realName: 'testrealname',
    channels: ['#channel1', '#channel2'],
    retryCount: 5
  }
};
