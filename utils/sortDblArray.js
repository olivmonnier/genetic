/**
 * Sort a double array with the index first
 * @function sortDblArray
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
module.exports = function (a, b) {
  if (a[0] === b[0]) {
    return 0;
  } else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}
