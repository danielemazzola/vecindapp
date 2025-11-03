// ----------------------
// GENERATE SKU ID UTILITY
// ----------------------
// THIS FUNCTION GENERATES A UNIQUE SKU IDENTIFIER BASED ON THE CURRENT DATE AND TIME
// THE FORMAT IS: SKU_YYYY-MM-DD-HH-MM-SS-MMM (PADDED TO 24 CHARACTERS)
const generateSkuId = () => {
  const now = new Date();

  // ----------------------
  // EXTRACT DATE AND TIME COMPONENTS
  // ----------------------
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const millis = String(now.getMilliseconds()).padStart(3, '0');

  // ----------------------
  // CREATE RAW STRING AND PAD TO 24 CHARACTERS
  // ----------------------
  const raw = `${year}${month}${day}${hour}${minute}${second}${millis}`.padEnd(24, '0');

  // ----------------------
  // FORMAT STRING INTO 6 GROUPS OF 4 CHARACTERS
  // ----------------------
  const formatted = raw.match(/.{1,4}/g).slice(0, 6).join('-');

  // ----------------------
  // RETURN FINAL SKU
  // ----------------------
  return `SKU_${formatted}`;
};

// ----------------------
// EXPORT
// ----------------------
module.exports = { generateSkuId };
