# Auth0 Cordova

Library to make it easy to integrate Auth0 login in your Cordova applications.

## Requirements

The library requires these two cordova plugins to work:

- cordova-plugin-safariviewcontroller: Shows Safari/Chrome browser ViewController/CustomTab
- cordova-plugin-customurlscheme: Handles the custom scheme url intents for callback

For use with windows native applications, another plugin is needed.
You'll need to add this plugin to config.xml by hand:
```
<plugin name="cordova-plugin-uwp-oauth" spec="https://github.com/zenput/cordova-plugin-uwp-oauth#2a15357ad88c90e1afb43200ff519552026c420b" />
```


you'll need to run

```bash
cordova plugin add cordova-plugin-safariviewcontroller
cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME={application package name} --variable ANDROID_SCHEME={application package name} --variable ANDROID_HOST={auth0 domain} --variable ANDROID_PATHPREFIX=/cordova/{application package name}/callback
```

> In cordova applications, the application package name is the widget's identifier in `config.xml`

So if you have the following values

* application package name or widget identifier: com.auth0.cordova.example
* auth0 domain: samples.auth0.com

in your config you should have some entries like

```xml
<preference name="AndroidLaunchMode" value="singleTask" />
<plugin name="cordova-plugin-customurlscheme" spec="~4.2.0">
    <variable name="URL_SCHEME" value="com.auth0.cordova.example" />
    <variable name="ANDROID_SCHEME" value="com.auth0.cordova.example" />
    <variable name="ANDROID_HOST" value="sample.auth0.com" />
    <variable name="ANDROID_PATHPREFIX" value="/cordova/com.auth0.cordova.example/callback" />
</plugin>
<plugin name="cordova-plugin-safariviewcontroller" spec="~1.4.6" />
```

## Setup

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

## Usage

```js
const auth0 = new Auth0Cordova({
  domain: "{YOUR_AUTH0_DOMAIN}",
  clientId: "{YOUR_AUTH0_CLIENT_ID}",
  packageIdentifier: "{WIDGET_ID_IN_CONFIG_XML}"
});

const options = {
  scope: 'openid profile',
};

auth0.authorize(options, function (err, result) {
  if (err) {
    // failure
  }
  // success!
});
```

This will open your tenant's hosted login page in the OS browser and will use OAuth 2.0 code grant flow with [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636).

Use the authorizeWindows method instead if on a windows native platform.

## API

For more information about our API please check our [online documentation](https://auth0.github.io/auth0-cordova/)

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

For auth0 related questions/support please use the [Support Center](https://support.auth0.com).

## Common Issues

1. The plugin is not working in Ionic / Cordova dev app. 

   The plugin needs to be deployed on a real device to function, this is so because the dev apps do not add the necessary plugins needed for this library to function correctly. You'll need to either create a clone / fork of the Dev App or need to deploy it to a real device to test. 

2. The app hangs after authentication 

   If 1 does not solve your problem, please make sure you have `cordova-plugin-customurlscheme` installed or an appropirate plugin to handle the callback (like deeplinks / universal links) and you are handling the callback appropriately


## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
