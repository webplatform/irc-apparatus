var _ = require('lodash-node');

/**
 * Coerces a comma- or semicolon-delimited string into an array, if needed.
 * @param  {(array|string)} val The value to check.
 * @return {array} An array, can be empty.
 */
exports.ensureArray = function ensureArray(val) {
  if (val === null || val === undefined) {
    return [];
  } else if (_.isArray(val)) {
    return val;
  } else if (_.isString(val)) {
    return val.split(/[,;]/);
  } else {
    return [val];
  }
};
