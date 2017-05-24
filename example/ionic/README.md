## Auth0 - Ionic 2 Login

This sample demonstrates how to add authentication to an Ionic 2 application using Auth0.

## Installation

Clone the repo and install the dependencies.

```bash
npm install
```

## Build the Auth0 Cordova library

This example relies on a local build of the Auth0 Cordova library. To create it change to the top level of your checkout and execute the following:

```bash
npm install
npm run build
```
## Set Auth0 Variable

Rename the `auth0-variables.ts.example` file to `auth0-variables.ts` and populate it with your application's  Auth0 client ID and domain.

## Add to the Allowed Callback URLs for your Auth0 Client

The easiest way to get the correct URL is to run the example and perform a login. It will fail with `Callback URL Mismatch` displayed. On your Auth0 dashboard click the `Logs` link and click on the latest `Failed Login` entry. Copy the URL from the error message and paste it in the `Allowed Callback URLs` text entry field for your Client and save. If you have multiple entries they must be separated by commas.

`e.g. com.example.demo://example.auth0.com/cordova/com.example.demo/callback`

## Add the `InAppBrowser` Plugin

You must install the `InAppBrowser` plugin from Cordova to be able to show the Login popup. The seed project already has this plugin added, but if you are adding Auth0 to your own application you need to run the following command:

```bash
ionic plugin add cordova-plugin-inappbrowser
```

and then add the following configuration to the `config.xml` file:

```xml
<feature name="InAppBrowser">
  <param name="ios-package" value="CDVInAppBrowser" />
  <param name="android-package" value="org.apache.cordova.inappbrowser.InAppBrowser" />
</feature>
```

## Run the Application

To serve the applicaton in the browser, use `ionic serve`.

```bash
ionic serve
```

To emulate the application, you'll need to add the plaform you wish to emulate, so for ios it will be

```bash
ionic platform add ios
```

and then use `ionic emulate`. You may optionally choose a target device for the platform you are using.

```bash
ionic emulate ios --target="iPhone-6"
```

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [JSON Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
