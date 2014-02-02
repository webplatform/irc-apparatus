var debug = require('debug')('ircapp:utils');
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

// includes some common aliases
var colors = {
  white: 0,
  black: 1,
  blue: 2,
  navy: 2,
  green: 3,
  red: 4,
  brown: 5,
  maroon: 5,
  purple: 6,
  orange: 7,
  olive: 7,
  yellow: 8,
  lightGreen: 9,
  lime: 9,
  teal: 10,
  lightTeal: 11,
  cyan: 11,
  aqua: 11,
  lightBlue: 12,
  royal: 12,
  pink: 13,
  violet: 13,
  lightPurple: 13,
  fuchsia: 13,
  gray: 14,
  grey: 14,
  lightGray: 15,
  lightGrey: 15,
  transparent: 99 // depends on client
};
exports.colors = colors;

var codes = {
  bold: '\u0002',
  color: '\u0003',
  //italic: '\u0009', // rarely implemented
  //strike: '\u0013', // rarely implemented
  reset: '\u000f',
  italic: '\u0016', // depends on client, sometimes means reverse
  underline: '\u001f'
};
exports.codes = codes;

// TODO strip control codes helper + filter

function wrap(str, prefix, suffix) {
  if (typeof suffix === 'undefined') {
    suffix = prefix;
  }
  return prefix + str + suffix;
}

// TODO refactor as a class or something
function getStringHelper(str) {
  var helpers = {};
  helpers._string = str;
  helpers.toString = function() {
    return helpers._string;
  };

  _.each(codes, function(value, key) {
    if (key === 'color' || key === 'reset') {
      // ignore color and reset
      return;
    }
    Object.defineProperty(helpers, key, {
      get: function() {
        helpers._string = wrap(helpers._string, value);
        return helpers;
      },
      configurable: true
    });
  });

  helpers.color = function(fg, bg) {
    if (typeof fg === 'string') {
      fg = colors[fg];
    }
    if (typeof bg === 'string') {
      bg = colors[bg];
    }
    if (fg < 10) {
      // make sure to print 2 digits for the color, so following digits in the text don't get lost
      fg = '0' + fg;
    }
    if (typeof bg !== 'undefined' && bg < 10) {
      // make sure to print 2 digits for the color, so following digits in the text don't get lost
      bg = '0' + bg;
    }
    var s = codes.color + fg;
    if (typeof bg !== 'undefined') {
      s += ',' + bg;
    }
    s += str;
    s += codes.color;
    return s;
  };

  _.each(colors, function(value, key) {
    if (value < 10) {
      // make sure to print 2 digits for the color, so following digits in the text don't get lost
      value = '0' + value;
    }
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
