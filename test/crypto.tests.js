const expect = require('chai').expect;
const crypto = require('../src/crypto');

describe('crypto', function () {

  describe('generateProofKey', function () {
    const proofKey = crypto.generateProofKey();

    it('should generate verifier', function () {
      expect(proofKey.codeVerifier).to.not.be.undefined;
    });

    it('should generate challenge', function () {
      expect(proofKey.codeChallenge).to.not.be.undefined;
    });

    it('should always generate new proof keys', function () {
      const newProofKey = crypto.generateProofKey();
      expect(newProofKey.codeVerifier).to.not.equal(proofKey.codeVerifier);
      expect(newProofKey.codeChallenge).to.not.equal(proofKey.codeChallenge);
    });

  });

  describe('generateState', function () {
    it('should generate state', function () {
      expect(crypto.generateState()).to.not.be.undefined;
    });

    it('should generate distinct states', function () {
      const first = crypto.generateState()
      expect(crypto.generateState()).to.not.equal(first);
    });
  });
});