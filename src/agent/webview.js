// Fallback to old WebView where SFSafariViewController is not supported
function WebView() {
  this.tab = null;
  this.handler = null;
  this.open = this.open.bind(this);
  this.handleFirstLoadEnd = this.handleFirstLoadEnd.bind(this);
  this.handleLoadError = this.handleLoadError.bind(this);
  this.handleExit = this.handleExit.bind(this);
  this.clearEvents = this.clearEvents.bind(this);
  this.close = this.close.bind(this);
}

WebView.prototype.open = function (url, handler) {
  var browser = window.cordova.InAppBrowser;
  var tab = browser.open(url, '_blank');

  tab.addEventListener('loadstop', this.handleFirstLoadEnd);
  tab.addEventListener('loaderror', this.handleLoadError);
  tab.addEventListener('exit', this.handleExit);
  this.tab = tab;
  this.handler = handler;
};

WebView.prototype.handleFirstLoadEnd = function () {
  this.handler(null, { event: 'loaded' });
};

WebView.prototype.handleLoadError = function (e) {
  this.clearEvents();
  this.handler(e, null);
};

WebView.prototype.handleExit = function () {
  this.clearEvents();
  this.handler(null, { event: 'closed' });
};

WebView.prototype.clearEvents = function () {
  if (this.tab.null) {
    return;
  }
  this.tab.removeEventListener('loaderror', this.handleLoadError);
  this.tab.removeEventListener('loadstop', this.handleFirstLoadEnd);
  this.tab.removeEventListener('exit', this.handleExit);
};

WebView.prototype.close = function () {
  if (this.tab != null) {
    this.tab.close();
  }
  this.clearEvents();
  this.tab = null;
  this.handler = null;
};


module.exports = WebView;
