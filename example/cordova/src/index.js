var Auth0Cordova =  require('@auth0/cordova');
var App = require('./App');

// In a real world app, you should replace this with React
// or Angular or jQuery.
function main() {
    var app = new App();
    function intentHandler(url) {
        Auth0Cordova.onRedirectUri(url);
    }
    window.handleOpenURL = intentHandler;
    app.run('#app');
}

document.addEventListener('deviceready', main);
