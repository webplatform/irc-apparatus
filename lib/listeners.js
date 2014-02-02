var debug = require('debug')('ircapp:listeners');
var _ = require('lodash-node');
var XRegExp = require('xregexp').XRegExp;
var Q = require('q');
var listenerTypes = require('./listener-types');
var Utils = require('./utils');

function Listeners(bot) {
  this.bot = bot;
  this.ircListenersByType = {};
  this.listenersByType = {};
}

Listeners.prototype._createIrcListener = function(typeName) {
  var type = listenerTypes[typeName];
  if (typeof type === 'undefined') {
    debug('_createIrcListener(): can\'t create listener: unknown listener type \'' + typeName + '\'');
    return;
  }

  if (typeof this.ircListenersByType[typeName] !== 'undefined') {
    return this.ircListenersByType[typeName];
  }
  var ircListener = function() {
    var args = arguments;
    var baseContext = {
      event: typeName
    };
    _.each(type.args, function(name, index) {
      baseContext[name] = args[index];
    });
    if (typeof baseContext.channels === 'undefined' && typeof baseContext.channel !== 'undefined') {
      baseContext.channels = arguments[baseContext.channel];
    }

    baseContext.reply = function(msg) {
      if (!msg) {
        debug('reply(): called with missing message');
        return;
      }
      if (typeof baseContext.channel !== 'undefined') {
        this.bot.irc.say(baseContext.channel, msg);
      } else if (typeName === 'notice') {
        baseContext.replyNotice(msg);
      } else if (typeName === 'pm') {
        baseContext.replyPm(msg);
      }
    }.bind(this);
    baseContext.replyNotice = function(msg) {
      if (!msg) {
        debug('replyNotice(): called with missing message');
        return;
      }
      if (typeof baseContext.source === 'undefined') {
        debug('replyNotice(): undefined source');
        return;
      }
      this.bot.irc.notice(baseContext.source, msg);
    }.bind(this);
    baseContext.replyPm = function(msg) {
      if (!msg) {
        debug('replyPm(): called with missing message');
        return;
      }
      if (typeof baseContext.source === 'undefined') {
        debug('replyPm(): undefined source');
        return;
      }
      this.bot.irc.say(baseContext.source, msg);
    }.bind(this);

    this.listenersByType[typeName].forEach(function(info) {
      // info = { type:, filters:, fn:, data: }

      var context = _.clone(baseContext);
      context.data = info.data;

      var passedFilters = true;
      _.each(info.filters, function(filterData, filterName) {
        if (!passedFilters) {
          // one filter vetoed, no need to check the others
          return;
        }

        var filterFn = this.bot.getFilter(filterName);
        var result = filterFn(context, filterData);
        if (result === false) {
          passedFilters = false;
        }
      }.bind(this));

      if (passedFilters) {
        info.fn(context);
      }
    }.bind(this));
  }.bind(this);
  this.ircListenersByType[typeName] = ircListener;
  this.bot.irc.on(type.event || typeName, ircListener);
  debug('_createIrcListener(): created new listener for type \'' + typeName + '\'');
};

Listeners.prototype._deleteIrcListener = function(typeName) {
  var type = listenerTypes[typeName];
  if (typeof type === 'undefined') {
    debug('_deleteIrcListener(): can\'t delete listener: unknown listener type \'' + typeName + '\'');
    return;
  }

  if (typeof this.ircListenersByType[typeName] === 'undefined') {
    debug('_deleteIrcListener(): can\'t delete listener: no listener registered for type \'' + typeName + '\'');
    return;
  }

  this.bot.irc.removeListener(type.event || typeName, this.ircListenersByType[typeName]);
  delete this.ircListenersByType[typeName];
  debug('_deleteIrcListener(): deleted listener for type \'' + typeName + '\'');
};

Listeners.prototype.add = function(types, filters, fn, data) {
  if (arguments.length === 2) {
    // addListener(types, fn)
    fn = filters;
    filters = undefined;
    // TODO check typeof fn?
  } else if (arguments.length === 3) {
    if (_.isFunction(fn)) {
      // addListener(types, filters, fn)
    } else if (_.isFunction(filters)) {
      // addListener(types, fn, data)
      data = fn;
      fn = filters;
      filters = undefined;
    } else {
      // TODO throw/warn?
    }
  } else if (arguments.length === 4) {
    // addListener(types, filters, fn, data)
  } else {
    // TODO throw/warn?
  }

  types = Utils.ensureArray(types);

  if (types.length === 0) {
    debug('add(): can\'t register listener: no types specified');
    return;
  }

  types.forEach(function(typeName) {
    var type = listenerTypes[typeName];
    if (typeof type === 'undefined') {
      debug('add(): can\'t register listener: unknown listener type \'' + typeName + '\'');
      return;
    }

    if (typeof this.listenersByType[typeName] === 'undefined') {
      // no other listeners for this type were registered yet
      this.listenersByType[typeName] = [];
    }

    if (this.listenersByType[typeName].length === 0) {
      // start up an irc listener for this event
      this._createIrcListener(typeName);
    }

    debug('add(): registering listener for type \'' + typeName + '\'');
    var info = {
      type: type,
      filters: filters,
      data: data,
      fn: fn
    };
    this.listenersByType[typeName].push(info);
  }.bind(this));
};

Listeners.prototype.remove = function(types, fn) {
  if (arguments.length === 1) {
    fn = types;
    types = undefined;
  }

  debug('remove(): removing listeners');
  var typesToIterate = this.listenersByType;
  if (typeof types !== 'undefined') {
    typesToIterate = _.pick(typesToIterate, Utils.ensureArray(types));
  }
  _.each(typesToIterate, function(infos, typeName) {
    _.remove(infos, { fn: fn });
    if (infos.length === 0) {
      // no listeners left for this event, so we don't need the irc listener anymore
      this._deleteIrcListener(typeName);
    }
  }.bind(this));
};

module.exports = Listeners;
