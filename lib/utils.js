var _ = require('lodash-node');

/**
 * Coerces a comma- or semicolon-delimited string into an array, if needed.
 * @param  {(array|string)} val The value to check.
 * @return {array} An array, can be empty.
 */
function ensureArray(val) {
  if (val === null || val === undefined) {
    return [];
  } else if (_.isArray(val)) {
    return val;
  } else if (_.isString(val)) {
    return val.split(/[,;]/);
  } else {
    return [val];
  }
}
exports.ensureArray = ensureArray;

var colors = {
  white: 0,
  black: 1,
  blue: 2,
  green: 3,
  red: 4,
  brown: 5,
  purple: 6,
  magenta: 6,
  orange: 7,
  yellow: 8,
  lightGreen: 9,
  teal: 10,
  cyan: 10,
  lightTeal: 11,
  lightCyan: 11,
  lightBlue: 12,
  pink: 13,
  lightMagenta: 13,
  gray: 14,
  lightGray: 15,
  transparent: 99 // not normally supported, except by, for example, mIRC
};
exports.colors = colors;

var codes = {
  bold: '\u0002',
  color: '\u0003',
  reset: '\u000f',
  reverse: '\u0016',
  underline: '\u001f'
};
exports.codes = codes;

function wrap(str, prefix, suffix) {
  if (typeof suffix === "undefined") {
    suffix = prefix;
  }
  return prefix + str + suffix;
}

function getStringHelper(str) {
  var helpers = {};
  helpers._string = str;
  helpers.toString = function() {
    return helpers._string;
  };

  ['bold', 'reset', 'reverse', 'underline'].forEach(function(prop) {
    Object.defineProperty(helpers, prop, {
      get: function() {
        helpers._string = wrap(helpers._string, codes[prop]);
        return helpers;
      },
      configurable: true
    });
  });

  _.each(colors, function(value, key) {
    Object.defineProperty(helpers, key, {
      get: function() {
        helpers._string = wrap(helpers._string, codes.color + value, codes.color);
        return helpers;
      },
      configurable: true
    });
  });

  return helpers;
}

Object.defineProperty(String.prototype, 'irc', {
  get: function() {
    return getStringHelper(this);
  },
  configurable: true
});
