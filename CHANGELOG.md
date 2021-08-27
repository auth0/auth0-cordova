# Change Log

## [v0.4.4](https://github.com/auth0/auth0-cordova/tree/v0.4.4) (2021-08-27)

**Dependencies**

Various dependency updates. Also Webpack@4 to fix a build issue with `asn1.js` and `auth0-js@9.16.4` to bring in `crypto-js@4` and fix a vulnerability there. [\#177](https://github.com/auth0/auth0-cordova/pull/177) ([stevehobbsdev](https://github.com/stevehobbsdev))

## [v0.4.3](https://github.com/auth0/auth0-cordova/tree/v0.4.3) (2020-01-21)

**Dependencies**

- Bump cordova-plugin-ionic-webview in /example/wkwebview [\#119](https://github.com/auth0/auth0-cordova/pull/119) (dependabot)
- Bump codecov from 3.6.1 to 3.6.5 [\#122](https://github.com/auth0/auth0-cordova/pull/122) (dependabot)
- Security upgrade url-parse from 1.4.3 to 1.4.5 [\#123](https://github.com/auth0/auth0-cordova/pull/123) (dependabot)

## [v0.4.2](https://github.com/auth0/auth0-cordova/tree/v0.4.2) (2020-01-24)

[Full Changelog](https://github.com/auth0/auth0-cordova/compare/v0.4.1...v0.4.2)

**Changed**

Bumped auth0-js to 9.12.2 for removal of issued-at time check [\#116](https://github.com/auth0/auth0-cordova/pull/116) ([stevehobbsdev](https://github.com/stevehobbsdev))

## [v0.4.1](https://github.com/auth0/auth0-cordova/tree/v0.4.1) (2019-10-16)

[Full Changelog](https://github.com/auth0/auth0-cordova/compare/v0.4.0...v0.4.1)

**Changed**

Bumped auth0-js to 9.12.0 for better OIDC compliance [\113](https://github.com/auth0/auth0-cordova/pull/113) ([stevehobbsdev](https://github.com/stevehobbsdev))

## [v0.4.0](https://github.com/auth0/auth0-cordova/tree/v0.4.0) (2019-10-16)

[Full Changelog](https://github.com/auth0/auth0-cordova/compare/v0.3.0...v0.4.0)

**Changed**

- Reformatted telemetry object [\#110](https://github.com/auth0/auth0-cordova/pull/110) ([stevehobbsdev](https://github.com/stevehobbsdev))
- Updated dependencies to fix vulnerabilities [\#111](https://github.com/auth0/auth0-cordova/pull/111) ([stevehobbsdev](https://github.com/stevehobbsdev))

## [v0.3.0](https://github.com/auth0/auth0-cordova/tree/v0.4.0) (2017-12-26)

[Full Changelog](https://github.com/auth0/auth0-cordova/compare/v0.2.0...v0.3.0)

**Changed**

- Deprecate Cordova sample [\#47](https://github.com/auth0/auth0-cordova/pull/47) ([chenkie](https://github.com/chenkie))
- Docs refer to client but it doesn't exist [\#61](https://github.com/auth0/auth0-cordova/pull/47) ([JohnMcLear](https://github.com/JohnMcLear))
- Updated Auth0.js version to 9.0.0 [\#53](https://github.com/auth0/auth0-cordova/pull/53) ([aaguiarz](https://github.com/aaguiarz))
- Update to handle Auth0.js 9 and Update Example to Cordova 8.0 ([faafd9](https://github.com/auth0/auth0-cordova/commit/faafd9644f06853b55df516cbd2915b1a1eeead5)) ([darkyen](https://github.com/darkyen))

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

- application package name or widget identifier: com.auth0.cordova.example
- auth0 domain: samples.auth0.com

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
  domain: '{YOUR_AUTH0_DOMAIN}',
  clientId: '{YOUR_AUTH0_CLIENT_ID}',
  packageIdentifier: '{WIDGET_ID_IN_CONFIG_XML}',
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
