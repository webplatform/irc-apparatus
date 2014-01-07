var app = require('../../index.js');

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
});
