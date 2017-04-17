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
        domain: this.domain
    });
}


Auth0Cordova.prototype.authorize = function (parameters, callback) {
    if (typeof parameters === 'function') {
        parameters = callback;
        parameters = {};
    }

    if (!cb || typeof cb === 'function') {
        throw new Error('callback not specified or is not a function');
    }

    getAgent(function (err, agent) {
        if (err) {
            return callback(err);
        }

        var keys = generateProofKey(),
            client = this.client,
            redirectUri = this.redirectUri;

        parameters.state = parameters.state || generateState();

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
                    return callback(error);
                }

                var handled = url.indexOf(redirectUri) !== -1;
                if (!handled) {
                    return handled;
                }

                if (!url || typeof url !== 'string') {
                    return callback(new Error('url must be a string'));
                }

                var response = parse(url, true).query;
                if (response.error) {
                    return callback(new Error(response.error_description || response.error));
                }

                var responseState = response.state;
                if (responseState !== requestState) {
                    return callback(new Error('Response state does not match expected state'));
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

                return handled;
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