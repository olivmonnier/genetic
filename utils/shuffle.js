/**
 * Shuffle an array
 * @function shuffle
 * @param {Array} a
 * @return {Array}
 */
module.exports = function (a) {
  var j, x, i;

  for (i = a.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
  }

  return a;
}
