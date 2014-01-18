var util = require('util');
var path = require('path');
var debug = require('debug')('ircapp:bot');
var _ = require('lodash-node');
var XRegExp = require('xregexp').XRegExp;
var Q = require('q');
var IRC = require('irc');


// Note that everything not defined inside the Bot class below is shared between instances

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
    debug('loading config');
    var customConfig = {};
    if (typeof settings === 'object') {
      customConfig = settings;
    } else if (typeof settings === 'string') {
      var filepath = path.resolve(settings);
      debug('loading custom settings from: ' + filepath);
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
   * Coerces a comma- or semicolon-delimited string into an array, if needed.
   * @param  {(array|string)} val The value to check.
   * @return {array} An array, can be empty.
   */
  function ensureArray(val) {
    if (!val) {
      return [];
    } else if (_.isArray(val)) {
      return val;
    } else if (_.isString(val)) {
      return val.split(/[,;]/);
    } else {
      return [];
    }
  }

  function config(key) {
    var value = conf.get(key);
    // Force certains keys to return arrays
    if (_.contains(['bot:plugins', 'irc:channels'], key)) {
      // TODO make the array extendable?
      value = ensureArray(value);
    }
    return value;
  }

  // Only expose public APIs
  return {
    loadConfig: loadConfig,
    config: config
  };
}

module.exports = Bot;
