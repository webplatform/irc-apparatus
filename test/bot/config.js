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
      bot.config('bot').should.deep.equal(defaultConfig.bot);
      bot.config('irc').should.deep.equal(defaultConfig.irc);
    });
  });

  describe('with custom settings via object', function() {
    var bot;

    before(function() {
      bot = app.Bot(customConfig);
    });

    it('should be initialized with the custom config', function() {
      var expected = _.merge(_.cloneDeep(defaultConfig), customConfig);
      bot.config('bot').should.deep.equal(expected.bot);
      bot.config('irc').should.deep.equal(expected.irc);
    });

    it('should be reloadable with another config', function() {
      var customConfig2 = _.cloneDeep(customConfig);
      customConfig2.bot.plugins[0] = 'my-plugin';
      delete customConfig2.irc.userName;
      delete customConfig2.irc.secure;
      customConfig2.irc.channels = ['&anotherChannel'];
      bot.loadConfig(customConfig2);
      var expected = _.merge(_.cloneDeep(defaultConfig), customConfig2);
      bot.config('bot').should.deep.equal(expected.bot);
      bot.config('irc').should.deep.equal(expected.irc);
    });
  });
});
