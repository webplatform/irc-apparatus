var _ = require('lodash-node');
var app = require('../../index.js');

var defaultConfig = {
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
    retryCount: 10
  }
};

var customConfig = {
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

describe('The Bot config', function() {
  describe('with default settings', function() {
    var bot;

    before(function() {
      bot = app.Bot();
    });

    it('should create a bot', function() {
      bot.should.be.an('object');
    });

    it('should be initialized with the default config', function() {
      bot.conf('bot').should.deep.equal({
        plugins: []
      });
      bot.conf('irc').should.deep.equal({
        server: null,
        port: 6667,
        secure: false,
        password: null,
        nick: null,
        userName: null,
        realName: null,
        channels: [],
        retryCount: 10
      });
    });
  });

  describe('with custom settings via object', function() {
    var bot;

    before(function() {
      bot = app.Bot(customConfig);
    });

    it('should be initialized with the custom config', function() {
      var expected = _.merge(_.cloneDeep(defaultConfig), customConfig);
      bot.conf('bot').should.deep.equal(expected.bot);
      bot.conf('irc').should.deep.equal(expected.irc);
    });

    // TODO: change values, reload
  });
});
