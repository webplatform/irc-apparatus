var debug = require('debug')('ircapp:services');
var _ = require('lodash-node');

function Services(bot) {
  this.bot = bot;
  this.services = {};
}

Services.prototype.add = function(name, fn) {
  if (_.has(this.services, name)) {
    debug('add(): service \'' + name + '\' already exists'); // TODO throw?
    return;
  }
  if (_.isFunction(fn)) {
    debug('add(): adding service \'' + name + '\'');
    this.services[name] = fn;
  } else {
    debug('add(): ignoring \'' + name + '\', not a function: ' + fn); // TODO throw?
  }
};

Services.prototype.remove = function(name) {
  if (!_.has(this.services, name)) {
    debug('remove(): service \'' + name + '\' not found');
    return;
  }
  debug('remove(): deleting service \'' + name + '\'');
  delete this.services[name];
};

Services.prototype.get = function(name) {
  if (!_.has(this.services, name)) {
    return undefined;
  }
  return this.services[name];
};

module.exports = Services;
