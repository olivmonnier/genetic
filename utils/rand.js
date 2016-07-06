/**
 * Get a random number between a min and max value
 * @function rand
 * @param {Integer} min
 * @param {Integer} max
 * @return {Integer}
 */
module.exports = function (min, max) {
  return Math.floor(Math.random() * max) + min;
}
