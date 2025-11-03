// ----------------------
// FORMAT FOR URL UTILITY
// ----------------------
// THIS FUNCTION TAKES A STRING AND FORMATS IT FOR URL USE
// IT REPLACES SPACES WITH '+' AND CONVERTS THE STRING TO LOWERCASE
const formatForURL = (string) => {
  return string.replace(/ /g, '+').toLowerCase();
};

// ----------------------
// EXPORT
// ----------------------
module.exports = formatForURL;
