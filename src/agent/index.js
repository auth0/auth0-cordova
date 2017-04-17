var BrowserAgent = require('./browser');
var WebViewAgent = require('./webview');

module.exports = function getAgent() {
  return BrowserAgent.isAvailable(function (available) {
    if(available) {
      return callback(new BrowserAgent());
    }
    return callback(new WebViewAgent());
  });
};

