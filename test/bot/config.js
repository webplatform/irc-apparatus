var os = require('os');
var fs = require('fs');
var path = require('path');
var _ = require('lodash-node');
var app = require('../../');

var defaultConfig = require('../_fixtures/defaultConfig.js');
var customConfig = require('../_fixtures/customConfig.js');
var customConfig2 = require('../_fixtures/customConfig2.js');
var customConfig3 = require('../_fixtures/customConfig3.js');

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
      bot.loadConfig(customConfig2);
      var expected = _.merge(_.cloneDeep(defaultConfig), customConfig2);
      bot.config('bot').should.deep.equal(expected.bot);
      bot.config('irc').should.deep.equal(expected.irc);
    });
  });

  describe('with custom settings via file', function() {
    var srcFile = path.resolve(__dirname, '../_fixtures/customConfig.js');
    var srcFile2 = path.resolve(__dirname, '../_fixtures/customConfig2.js');
    var srcFile3 = path.resolve(__dirname, '../_fixtures/customConfig3.js');
    var tmpDir = os.tmpDir();
    var tmpFile = path.resolve(tmpDir, 'irc-apparatus-temp-config.js');
    var tmpFile2 = path.resolve(tmpDir, 'irc-apparatus-temp-config2.js');
    var bot;

    before(function(done) {
      bot = app.Bot();
      // copy our fixtures
      fs.createReadStream(srcFile).pipe(fs.createWriteStream(tmpFile)).on('finish', function() {
        fs.createReadStream(srcFile2).pipe(fs.createWriteStream(tmpFile2)).on('finish', function() {
          done();
        });
      });
    });

    after(function() {
      // clean up
      fs.unlinkSync(tmpFile);
      fs.unlinkSync(tmpFile2);
    });

    it('should be initialized with the custom config via an absolute path', function() {
      bot.loadConfig(tmpFile);
      var expected = _.merge(_.cloneDeep(defaultConfig), customConfig);
      bot.config('bot').should.deep.equal(expected.bot);
      bot.config('irc').should.deep.equal(expected.irc);
    });

    it('should be reloadable with another file via a relative path', function() {
      var cwd = process.cwd();
      process.chdir(tmpDir);
      bot.loadConfig(tmpFile2);
      process.chdir(cwd);

      var expected = _.merge(_.cloneDeep(defaultConfig), customConfig2);
      bot.config('bot').should.deep.equal(expected.bot);
      bot.config('irc').should.deep.equal(expected.irc);
    });

    it('should re-read a modified file, which was already loaded before', function(done) {
      fs.createReadStream(srcFile3).pipe(fs.createWriteStream(tmpFile)).on('finish', function() {
        bot.loadConfig(tmpFile);
        var expected = _.merge(_.cloneDeep(defaultConfig), customConfig3);
        bot.config('bot').should.deep.equal(expected.bot);
        bot.config('irc').should.deep.equal(expected.irc);
        done();
      });
    });
  });

  describe('should ensure arrays for', function() {
    var bot;

    before(function() {
      bot = app.Bot();
    });

    it('bot:plugins', function() {
      bot.loadConfig({
        bot: {
          plugins: 'a,b;c'
        }
      });
      bot.config('bot:plugins').should.deep.equal(['a', 'b', 'c']);
    });

    it('irc:channels', function() {
      bot.loadConfig({
        irc: {
          channels: 'a,b;c'
        }
      });
      bot.config('irc:channels').should.deep.equal(['a', 'b', 'c']);
    });
  });
});
