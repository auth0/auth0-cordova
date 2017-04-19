// Fallback to old WebView where SFSafariViewController is not supported
function WebViewAgent() {
    this.tab = null;
    this.handler = null;
    this.open = this.open.bind(this);
    this.handleFirstLoadEnd = this.handleFirstLoadEnd.bind(this);
    this.handleLoadError = this.handleLoadError.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.clearEvents = this.clearEvents.bind(this);
    this.close = this.close.bind(this);    
}

WebViewAgent.prototype.open = function(url, handler) {
    var browser = cordova.InAppBrowser;
    var tab = browser.open(url, '_blank');

    tab.addEventListener('loadstop', this.handleFirstLoadEnd);
    tab.addEventListener('loaderror', this.handleLoadError);
    tab.addEventListener('exit', this.handleExit);
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
    this.tab.removeEventListener('loaderror', this.handleLoadError);
    this.tab.removeEventListener('loadstop', this.handleFirstLoadEnd);
    this.tab.removeEventListener('exit', this.handleExit);
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
