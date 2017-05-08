function Browser() {
  this.browser = window.SafariViewController;
  this.open = this.open.bind(this);
  this.close = this.close.bind(this);
}

Browser.isAvailable = function (callback) {
  window.SafariViewController.isAvailable(callback);
};


Browser.prototype.open = function (url, callback) {
  var options = {
    hidden: false,
    url: url
  };

  this.browser.show(options, function (result) {
    callback(null, result);
  }, function (message) {
    callback(new Error(message));
  });
};

Browser.prototype.close = function () {
  this.browser.hide();
};

module.exports = Browser;
