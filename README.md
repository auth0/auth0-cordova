# Auth0 Cordova

## Setup

Copy the contents of this library to your project in a folder named `auth0-cordova`.

> This library is written with JS ES6 so you might need to configure babel to transpile it to ES5 if you haven't done it for your app.

Then, since the library requires these two cordova plugins to work:

- cordova-plugin-safariviewcontroller: Shows Safari/Chrome browser ViewController/CustomTab
- cordova-plugin-customurlscheme: Handles the custom scheme url intents for callback

you'll need to run 

```bash
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME={application package name} --variable ANDROID_SCHEME={application package name} --variable ANDROID_HOST={auth0 domain} --variable ANDROID_PATHPREFIX=/cordova/{application package name}/callback
```

> In cordova applications, the application package name is the widget's id in the file `config.xml`

So if you have the following values

* application package name: com.auth0.cordova.example
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

then in your index.js you need to register the url handler `ondeviceready`

```js
import Auth0Cordova from './auth0-cordova';

function main() {
    function intentHandler(url) {
        Auth0Cordova.onRedirectUri(url);
    }
    window.handleOpenURL = intentHandler;
    // init your application
}

document.addEventListener('deviceready', main);
```

and to use is as simple as

```js
const client = new Auth0Cordova({
  clientId: "{auth0 client id}",
  domain: "{auth0 domain}",
  packageIdentifier: "{application package name}"
});

const options = {
  scope: 'openid profile',
};

client
  .authorize(options)
  .then((authResult) => {
    // SUCCESS!
  })
  .catch((error) => {
    // ERROR!
  });
}
```

## TODO

- [x] state verification
- [ ] use custom error
- [ ] better error handling in public API
- [ ] validate parameters of functions
- [ ] unit tests
- [ ] fetch package identifier automatically
- [ ] make it a cordova plugin
- [ ] configure variables on plugin install