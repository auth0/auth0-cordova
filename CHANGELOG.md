# Change Log

## [v0.2.0](https://github.com/auth0/auth0-cordova/tree/v0.2.0) (2017-07-07)
[Full Changelog](https://github.com/auth0/auth0-cordova/compare/v0.1.0...v0.2.0)

**Changed**
- Handle InAppBrowser exit event correctly [\#34](https://github.com/auth0/auth0-cordova/pull/34) ([decates](https://github.com/decates))

## [v0.1.0](https://github.com/auth0/auth0-cordova/tree/v0.1.0) (2017-05-07)
[Full Changelog](https://github.com/auth0/auth0-cordova/tree/v0.1.0)

### Requirements

The library requires these two cordova plugins to work:

- cordova-plugin-safariviewcontroller: Shows Safari/Chrome browser ViewController/CustomTab
- cordova-plugin-customurlscheme: Handles the custom scheme url intents for callback

you'll need to run

```bash
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME={application package name} --variable ANDROID_SCHEME={application package name} --variable ANDROID_HOST={auth0 domain} --variable ANDROID_PATHPREFIX=/cordova/{application package name}/callback
```

> In cordova applications, the application package name is the widget's identifier in `config.xml`

So if you have the following values

* application package name or widget identifier: com.auth0.cordova.example
* auth0 domain: samples.auth0.com

in your config you should have some entries like

```xml
<plugin name="cordova-plugin-customurlscheme" spec="~4.2.0">
    <variable name="URL_SCHEME" value="com.auth0.cordova.example" />
    <variable name="ANDROID_SCHEME" value="com.auth0.cordova.example" />
    <variable name="ANDROID_HOST" value="sample.auth0.com" />
    <variable name="ANDROID_PATHPREFIX" value="/cordova/com.auth0.cordova.example/callback" />
</plugin>
<plugin name="cordova-plugin-safariviewcontroller" spec="~1.4.6" />
```

### Setup

From [npm](https://npmjs.org)

```sh
npm install @auth0/cordova
```

then in your index.js you need to register the url handler `ondeviceready`

```js
var Auth0Cordova = require('@auth0/cordova');

function main() {
    function handlerUrl(url) {
        Auth0Cordova.onRedirectUri(url);
    }
    window.handleOpenURL = handlerUrl;
    // init your application
}

document.addEventListener('deviceready', main);
```

### Usage

```js
const auth0 = new Auth0Cordova({
  domain: "{YOUR_AUTH0_DOMAIN}",
  clientId: "{YOUR_AUTH0_CLIENT_ID}",
  packageIdentifier: "{WIDGET_ID_IN_CONFIG_XML}"
});

const options = {
  scope: 'openid profile',
};

client.authorize(options, function (err, result) {
  if (err) {
    // failure
  }
  // success!
});
```

This will open your tenant's hosted login page in the OS browser and will use OAuth 2.0 code grant flow with [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636).
