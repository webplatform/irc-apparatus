var debug = require('debug')('ircapp:filters');
var _ = require('lodash-node');

function Filters(bot) {
  this.bot = bot;
  this.filters = {};
}

Filters.prototype.add = function(name, fn) {
  if (_.has(this.filters, name)) {
    debug('add(): filter \'' + name + '\' already exists'); // TODO throw?
    return;
  }
  if (_.isFunction(fn)) {
    debug('add(): adding filter \'' + name + '\'');
    this.filters[name] = fn;
  } else {
    debug('add(): ignoring \'' + name + '\', not a function: ' + fn); // TODO throw?
  }
};

Filters.prototype.remove = function(name) {
  if (!_.has(this.filters, name)) {
    debug('remove(): filter \'' + name + '\' not found');
    return;
  }
  debug('remove(): deleting filter \'' + name + '\'');
  delete this.filters[name];
};

Filters.prototype.get = function(name) {
  if (!_.has(this.filters, name)) {
    return undefined;
  }
  return this.filters[name];
};

module.exports = Filters;
