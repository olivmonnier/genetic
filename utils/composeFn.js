module.exports = function(arrayFn, val) {
  return arrayFn.reduce(function(sum, fn) {
    return fn(sum);
  }, val);
}
