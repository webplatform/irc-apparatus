var util = require('util');
var path = require('path');
var debug = require('debug')('ircapp:bot');
var _ = require('lodash-node');
var XRegExp = require('xregexp').XRegExp;
var Q = require('q');
var IRC = require('irc');
var Utils = require('./utils.js');


// Note that everything not defined inside the Bot class below is shared between instances


// if changed, modify test/_fixtures/defaultConfig.js too
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


/**
 * This class represents a bot which is connected to one server.
 * @param {(undefined|object|string)} settings See {@link Bot#loadConfig}
 */
function Bot(settings) {
  debug('creating new Bot instance');

  var conf;

  /**
   * Initialize the config system with the provided custom values.
   * @param  {(undefined|object|string)} settings Specify custom settings via an object or a file (pass the path as a string, it will be resolved relative to process.cwd()).
   */
  function loadConfig(settings) {
    debug('loadConfig(): initializing config');
    var customConfig = {};
    if (typeof settings === 'object') {
      customConfig = settings;
    } else if (typeof settings === 'string') {
      var filepath = path.resolve(settings);
      debug('loadConfig(): reading file: ' + filepath);
      delete require.cache[filepath];
      customConfig = require(filepath);
    }

    conf = require('nconf')
      .env()                                                        // First, look for environment variables (e.g. bot:debug=true)
      .argv()                                                       // If not found, look for arguments from node (e.g. --bot:debug=true)
      .add('custom', { type: 'literal', store: customConfig })      // If not found, look for a custom value
      .add('defaults', { type: 'literal', store: defaultConfig });  // If not found, look for a default value
  }

  // Initialize the config
  loadConfig(settings);

  /**
   * Return a config entry.
   * @param  {string} key the config key in 'a:b:c' format
   * @return {*}     the value of the config key or undefined if the key is not found
   */
  function config(key) {
    var value = conf.get(key);
    // Force certains keys to return arrays, useful for specifying e.g. bot:plugins via env or args
    if (_.contains(['bot:plugins', 'irc:channels'], key)) {
      // TODO make the array extendable?
      value = Utils.ensureArray(value);
    }
    return value;
  }


  var irc = new IRC.Client(config("irc:server"), config("irc:nick"), {
    debug: config("bot:debug"),
    port: config("irc:port"),
    secure: config("irc:secure"),
    userName: config("irc:userName"),
    realName: config("irc:realName"),
    channels: config("irc:channels"),
    retryCount: config("irc:retryCount"),
    autoConnect: false
  });

  function start() {
    debug('start(): connecting');
    irc.connect();
  }

  function stop() {
    debug('stop(): disconnecting');
    irc.disconnect();
  }


  // Only expose public APIs
  return {
    loadConfig: loadConfig,
    config: config,

    start: start,
    stop: stop
  };
}

module.exports = Bot;
