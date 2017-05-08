var crypto = require('crypto');

function base64UrlSafeEncode(string) {
  return string.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

exports.generateProofKey = function generateProofKey() {
  var codeVerifier = base64UrlSafeEncode(crypto.randomBytes(32));
  var codeChallenge = base64UrlSafeEncode(sha256(codeVerifier));
  return {
    codeVerifier: codeVerifier,
    codeChallenge: codeChallenge
  };
};

exports.generateState = function generateState() {
  return base64UrlSafeEncode(crypto.randomBytes(32));
};
