cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-safariviewcontroller.SafariViewController",
        "file": "plugins/cordova-plugin-safariviewcontroller/www/SafariViewController.js",
        "pluginId": "cordova-plugin-safariviewcontroller",
        "clobbers": [
            "SafariViewController"
        ]
    },
    {
        "id": "cordova-plugin-customurlscheme.LaunchMyApp",
        "file": "plugins/cordova-plugin-customurlscheme/www/ios/LaunchMyApp.js",
        "pluginId": "cordova-plugin-customurlscheme",
        "clobbers": [
            "window.plugins.launchmyapp"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-inappbrowser": "1.3.0",
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-safariviewcontroller": "1.4.7",
    "cordova-plugin-customurlscheme": "4.2.0"
};
// BOTTOM OF METADATA
});