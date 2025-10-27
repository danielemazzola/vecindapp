const generateSkuId = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const millis = String(now.getMilliseconds()).padStart(3, '0');

  const raw = `${year}${month}${day}${hour}${minute}${second}${millis}`.padEnd(24, '0');

  const formatted = raw.match(/.{1,4}/g).slice(0, 6).join('-');

  return `SKU_${formatted}`;
}

module.exports = { generateSkuId };
