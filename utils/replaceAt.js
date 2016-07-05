module.exports = function(str, index, character) {
  return str.substr(0, index) + character + str.substr(index + character.length);
}
