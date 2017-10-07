const crypto = require("crypto");
let sha1 = require("sha1");

// Create random Big Integer
exports.createRandomId = function (nrOfBytes) {
  let randomNumber = crypto.randomBytes(nrOfBytes); // Is this the right way?
  let sha = crypto
    .createHash("sha1")
    .update(randomNumber)
    .digest("hex");
  let parsedInt = parseInt(sha.substr(0, 10), 16);
  return parsedInt % Math.pow(2, nrOfBytes * 8);
};

exports.createRandomAlphaNumericIdentifier = function (nrOfBytes) {
  let randomNumber = crypto.randomBytes(nrOfBytes); // Is this the right way?
  return crypto
    .createHash("sha1")
    .update(randomNumber)
    .digest("hex");
};

exports.createHashFromKey = function (key, nrOfBytes) {
  let sha = crypto
  .createHash("sha1")
  .update(key.toString())
  .digest("hex");
  let parsedInt = parseInt(sha.substr(0, 10), 16);
  return parsedInt % Math.pow(2, nrOfBytes * 8);
};