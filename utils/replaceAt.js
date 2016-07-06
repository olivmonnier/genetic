/**
 * Replace one character into a string
 * @function replaceAt
 * @param {String} str
 * @param {Integer} index
 * @param {String} character
 * @return {String}
 */
module.exports = function(str, index, character) {
  return str.substr(0, index) + character + str.substr(index + character.length);
}
