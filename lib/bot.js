var util = require('util');
var path = require('path');
var debug = require('debug')('ircapp:bot');
var _ = require('lodash-node');
var IRC = require('irc');
var Utils = require('./utils');
var Listeners = require('./listeners');
var Filters = require('./filters');
var Services = require('./services');


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
    floodProtection: false,
    floodProtectionDelay: 500,
    retryCount: 10
  }
};
// TODO provide some mechanism for plugins to provide their default settings, maybe via their exports
// so they can easily use config() too


/**
 * This class represents a bot which is connected to one server.
 * @param {(undefined|object|string)} settings See {@link Bot#loadConfig}
 */
function Bot(settings) {
  debug('creating new Bot instance');
  var bot = {};

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
  bot.loadConfig = loadConfig;

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
  bot.config = config;


  var irc = new IRC.Client(config('irc:server'), config('irc:nick'), {
    debug: config('bot:debug'),
    port: config('irc:port'),
    secure: config('irc:secure'),
    userName: config('irc:userName'),
    realName: config('irc:realName'),
    channels: config('irc:channels'),
    retryCount: config('irc:retryCount'),
    floodProtection: config('irc:floodProtection'),
    floodProtectionDelay: config('irc:floodProtectionDelay'),
    autoConnect: false
  });
  bot.irc = irc;

  function start() {
    debug('start(): connecting');
    irc.connect();
  }
  bot.start = start;

  function stop(quitmsg) {
    debug('stop(): disconnecting');
    irc.disconnect(quitmsg);
  }
  bot.stop = stop;

  irc.on('abort', function(retryCount) {
    // keep retrying
    debug('on abort: limit of ' + retryCount + ' retries reached, connecting again');
    irc.connect();
  });


  var listeners = new Listeners(bot);
  bot.addListener = listeners.add.bind(listeners);
  bot.removeListener = listeners.remove.bind(listeners);


  var filters = new Filters(bot);
  bot.addFilter = filters.add.bind(filters);
  bot.getFilter = filters.get.bind(filters);
  bot.removeFilter = filters.remove.bind(filters);


  var services = new Services(bot);
  bot.addService = services.add.bind(services);
  bot.getService = services.get.bind(services);
  bot.removeService = services.remove.bind(services);


  // TODO core plugins
  // TODO core filters: self, !self, toself, !toself, fromself, !fromself, channel, !channel, prefix
  // TODO core services


  // TODO catch irc error event


  return bot;
}

module.exports = Bot;
