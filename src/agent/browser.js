function BrowserAgent() {
    this.browser = window.SafariViewController;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);    
}

BrowserAgent.isAvailable = function(callback) {
    window.SafariViewController.isAvailable(callback);
};


BrowserAgent.prototype.open = function(url, callback) {
    var options = {
        hidden: false,
        url: url,
    };

    this.browser.show(options, function (result){
        callback(null, result);
    }, function (message) {
        callback(new Error(message));
    });
};

BrowserAgent.prototype.close = function (){
    this.browser.hide();
};

module.exports = BrowserAgent;