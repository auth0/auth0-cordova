var parse = require('url-parse');
var auth0 = require('auth0-js');
var getAgent = require('./agent');
var crypto = require('./crypto');
var session = require('./session');

var generateProofKey = crypto.generateProofKey;
var generateState = crypto.generateState;

session.clean();

function getOS() {
  var userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }
}

function CordovaAuth(options) {
  this.clientId = options.clientId;
  this.domain = options.domain;
  this.redirectUri = options.packageIdentifier + '://' + options.domain + '/cordova/' + options.packageIdentifier + '/callback';
  this.client = new auth0.Authentication({
    clientID: this.clientId,
    domain: this.domain,
    _telemetryInfo: {
      version: CordovaAuth.version,
      name: 'auth0-cordova'
    }
  });
}

CordovaAuth.prototype.authorize = function (parameters, callback) {
  if (typeof parameters === 'function') {
    parameters = callback;
    parameters = {};
  }

  if (!callback || typeof callback !== 'function') {
    throw new Error('callback not specified or is not a function');
  }

  var self = this;

  getAgent(function (err, agent) {
    if (err) {
      return callback(err);
    }

    var keys = generateProofKey();
    var client = self.client;
    var redirectUri = self.redirectUri;
    var requestState = parameters.state || generateState();

    parameters.state = requestState;

    var params = Object.assign({}, parameters, {
      code_challenge_method: 'S256',
      responseType: 'code',
      redirectUri: redirectUri,
      code_challenge: keys.codeChallenge
    });

    var url = client.buildAuthorizeUrl(params);

    agent.open(url, function (error, result) {
      if (error != null) {
        session.clean();
        return callback(error);
      }

      if (result.event === 'closed' && getOS() === 'ios') {
        session.clean();
        return callback(new Error('user canceled'));
      }

      if (result.event !== 'loaded') {
        // Ignore any other events.
        return;
      }

      session.start(function (sessionError, redirectUrl) {
        if (sessionError != null) {
          callback(sessionError);
          return true;
        }

        if (redirectUrl.indexOf(redirectUri) === -1) {
          return false;
        }

        if (!redirectUrl || typeof redirectUrl !== 'string') {
          callback(new Error('url must be a string'));
          return true;
        }

        var response = parse(redirectUrl, true).query;
        if (response.error) {
          callback(new Error(response.error_description || response.error));
          return true;
        }

        var responseState = response.state;
        if (responseState !== requestState) {
          callback(new Error('Response state does not match expected state'));
          return true;
        }

        var code = response.code;
        var verifier = keys.codeVerifier;
        client.oauthToken({
          code_verifier: verifier,
          grantType: 'authorization_code',
          redirectUri: redirectUri,
          code: code
        }, function (exchangeError, exchangeResult) {
          agent.close();
          if (exchangeError) {
            return callback(exchangeError);
          }
          return callback(null, exchangeResult);
        });

        return true;
      });
    });
  });
};

CordovaAuth.onRedirectUri = function (url) {
  session.onRedirectUri(url);
};

CordovaAuth.version = '0.1.0';

module.exports = CordovaAuth;
