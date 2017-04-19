var parse = require('url-parse');
var auth0 = require('auth0-js');
var getAgent = require('./agent');
var crypto = require('./crypto');

var generateProofKey = crypto.generateProofKey;
var generateState = crypto.generateState;

function getOS() {
    var userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
        return "android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
    }
}

function NoSession() {
    return false;
}


function Auth0Cordova(options) {
    this.clientId = options.clientId;
    this.domain = options.domain;
    this.redirectUri = options.packageIdentifier + '://' + options.domain + '/cordova/' + options.packageIdentifier + '/callback';
    this.client = new auth0.Authentication({
        clientID: this.clientId,
        domain: this.domain,
        _telemetryInfo: {
            version: Auth0Cordova.version,
            name: 'auth0-cordova',
        },
    });
}

Auth0Cordova.version = '0.1.1';

Auth0Cordova.prototype.authorize = function (parameters, callback) {
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

        var keys = generateProofKey(),
            client = self.client,
            redirectUri = self.redirectUri,
            requestState = parameters.state || generateState();

        parameters.state = requestState;

        var params = Object.assign({}, parameters, {
            code_challenge_method: 'S256',
            responseType: 'code',
            redirectUri: redirectUri,
            code_challenge: keys.codeChallenge,
        });

        var url = client.buildAuthorizeUrl(params);

        agent.open(url, function (error, result) {
            if (error != null) {
                return callback(error);
            }
            if (result.event === 'closed' && getOS() === 'ios') {
                return callback(new Error('user canceled'));
            }
            Auth0Cordova.newSession(function (error, url) {
                if (error != null) {
                    callback(error);
                    return true;
                }

                if (url.indexOf(redirectUri) === -1) {
                    return false;
                }

                if (!url || typeof url !== 'string') {
                    callback(new Error('url must be a string'));
                    return true;
                }

                var response = parse(url, true).query;
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
                    code_verifier: keys.codeVerifier,
                    grantType: 'authorization_code',
                    redirectUri: redirectUri,
                    code: code,
                }, function (error, result) {
                    agent.close();
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, result);
                });

                return true;
            });
        });
    });
}


Auth0Cordova.currentSession = NoSession;
Auth0Cordova.newSession = function newSession(handler) {
    Auth0Cordova.currentSession(new Error('Only one instance of auth can happen at a time'));
    Auth0Cordova.currentSession = handler;
}

Auth0Cordova.onRedirectUri = function onRedirectUri(url) {
    if (Auth0Cordova.currentSession(null, url)) {
        Auth0Cordova.currentSession = NoSession;
    }
}

module.exports = Auth0Cordova;