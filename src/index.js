var parse = require('url-parse');
var auth0 = require('auth0-js');
var getAgent = require('./agent');
var crypto = require('./crypto');
var session = require('./session');
var getOS = require('./utils').getOS;
var version = require('./version').raw;

var generateProofKey = crypto.generateProofKey;
var generateState = crypto.generateState;
var closingDelayMs = 1000;

session.clean();

var telemetry = {
  version: version,
  name: 'auth0-cordova',
  lib_version: auth0.version
};

/**
 * Creates a new Cordova client to handle AuthN/AuthZ with OAuth and OS browser.
 * @constructor
 * @param {Object} options
 * @param {String} options.domain your Auth0 domain
 * @param {String} options.clientId your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
 * @see {@link https://auth0.com/docs/api/authentication}
 */
function CordovaAuth(options) {
  this.clientId = options.clientId;
  this.domain = options.domain;
  this.redirectUri = options.packageIdentifier + '://' + options.domain + '/cordova/' + options.packageIdentifier + '/callback';
  this.auth0 = new auth0.WebAuth({
    clientID: this.clientId,
    domain: this.domain
  });
  this.client = new auth0.Authentication(this.auth0, {
    clientID: this.clientId,
    domain: this.domain,
    _telemetryInfo: telemetry
  });
}

/**
 * @callback authorizeCallback
 * @param {Error} [err] error returned by Auth0 with the reason of the Auth failure
 * @param {Object} [result] result of the Auth request
 * @param {String} [result.accessToken] token that allows access to the specified resource server (identified by the audience parameter or by default Auth0's /userinfo endpoint)
 * @param {Number} [result.expiresIn] number of seconds until the access token expires
 * @param {String} [result.idToken] token that identifies the user
 * @param {String} [result.refreshToken] token that can be used to get new access tokens from Auth0. Note that not all clients can request them or the resource server might not allow them.
 */

/**
 * Opens the OS browser and redirects to `{domain}/authorize` url in order to initialize a new authN/authZ transaction
 *
 * @method authorize
 * @param {Object} parameters
 * @param {String} [parameters.state] value used to mitigate XSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
 * @param {String} [parameters.nonce] value used to mitigate replay attacks when using Implicit Grant. {@link https://auth0.com/docs/api-auth/tutorials/nonce}
 * @param {String} [parameters.scope] scopes to be requested during Auth. e.g. `openid email`
 * @param {String} [parameters.audience] identifier of the resource server who will consume the access token issued after Auth
 * @param {authorizeCallback} callback
 * @see {@link https://auth0.com/docs/api/authentication#authorize-client}
 * @see {@link https://auth0.com/docs/api/authentication#social}
 */
CordovaAuth.prototype.authorize = function (parameters, callback) {
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

      if (result.event === 'closed') {
        var handleClose = function () {
          if (session.isClosing) {
            session.clean();
            return callback(new Error('user canceled'));
          }
        };

        session.closing();
        if (getOS() === 'ios') {
          handleClose();
        } else {
          setTimeout(handleClose, closingDelayMs);
          return;
        }
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
        agent.close();

        client.oauthToken({
          code_verifier: verifier,
          grantType: 'authorization_code',
          redirectUri: redirectUri,
          code: code
        }, function (exchangeError, exchangeResult) {
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

/**
 * Handler that must be called with the redirect url the browser tries to open after the OAuth flow is done.
 * To listen to that event, using cordova-plugin-customurlscheme, you need to register a callback in the method `window.handleOpenURL`
 * ```
 * var Auth0Cordova = require('@auth0/cordova');
 * window.handleOpenURL = Auth0Cordova.onRedirectUri(url);
 * ```
 *
 * @method onRedirectUri
 * @param {String} url with a custom scheme relied to the application
 */
CordovaAuth.onRedirectUri = function (url) {
  // If we are running in UIWebView we need to wait
  if (window.webkit && window.webkit.messageHandlers) {
    return session.onRedirectUri(url);
  }

  return setTimeout(function () {
    session.onRedirectUri(url);
  }, 4);
};

CordovaAuth.version = version;

module.exports = CordovaAuth;
