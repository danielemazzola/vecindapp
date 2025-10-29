const formatForURL = (string) => {
  return string.replace(/ /g, '+').toLowerCase();
};
module.exports = formatForURL;