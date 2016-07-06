/**
 * Run a list of functions with a value started
 * @function composeFn
 * @param {Array} arrayFn
 * @param {*} val
 * @return {*}
 */
module.exports = function(arrayFn, val) {
  return arrayFn.reduce(function(sum, fn) {
    return fn(sum);
  }, val);
}
