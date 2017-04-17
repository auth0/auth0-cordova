// Fallback to old WebView where SFSafariViewController is not supported
function WebViewAgent() {
    this.tab = null;
    this.handler = null;
}

WebViewAgent.prototype.open = function(url, handler) {
    var browser = cordova.InAppBrowser;
    var tab = browser.open(url, '_blank');

    tab.addEventListener('loadstop', handleFirstLoadEnd);
    tab.addEventListener('loaderror', handleLoadError);
    tab.addEventListener('exit', handleExit);
    this.tab = tab;
    this.handler = handler;
}

WebViewAgent.prototype.handleFirstLoadEnd = function (ev) {
    this.handler(null, {event: 'loaded'});
}

WebViewAgent.prototype.handleLoadError = function (e) {
    this.clearEvents();
    handler(e, null);
}

WebViewAgent.prototype.handleExit = function() {
    this.clearEvents();
    handler(null, {event: 'closed'});
}

WebViewAgent.prototype.clearEvents = function(e) {
    if (this.tab.null) {
        return;
    }
    this.tab.removeEventListener('loaderror', handleLoadError);
    this.tab.removeEventListener('loadstop', handleFirstLoadEnd);
    this.tab.removeEventListener('exit', handleExit);
}

WebViewAgent.prototype.close = function () {
    if (this.tab != null) {
      this.tab.close();
    }
    this.clearEvents();
    this.tab = null;
    this.handler = null;
}


module.exports = WebViewAgent;
