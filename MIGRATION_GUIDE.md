# Migration Guide

We recommend replacing `@auth0/cordova` with the [Auth0 SPA SDK](https://github.com/auth0/auth0-spa-js) or any of its framework-specific wrappers: [auth0-react](https://github.com/auth0/auth0-react), [auth0-angular](https://github.com/auth0/auth0-angular), or [auth0-vue](https://github.com/auth0/auth0-vue).

## Using Ionic?

If your app is using Ionic, you can remove `@auth0/cordova` and follow our Ionic Quickstarts to integrate with our framework-specific wrappers.

### React

- [Quickstart](https://auth0.com/docs/quickstart/native/ionic-react/01-login)  
- [Sample app](https://github.com/auth0-samples/auth0-ionic-samples/tree/main/react#readme )

### Angular

- [Quickstart](https://auth0.com/docs/quickstart/native/ionic-angular/01-login)
- [Sample app](https://github.com/auth0-samples/auth0-ionic-samples/tree/main/angular#readme)

### Vue 

- [Quickstart](https://auth0.com/docs/quickstart/native/ionic-vue/01-login)
- [Sample app](https://github.com/auth0-samples/auth0-ionic-samples/tree/main/vue#readme)

## Not using Ionic?

You can still integrate the Auth0 SPA SDK into a non-Ionic Cordova app. Use the [migration of our Cordova sample app](https://github.com/auth0-samples/auth0-cordova-samples/compare/master...spa-sdk-migration) as an example.

Note that you will need to update the configuration of your Auth0 application. Go to the **Settings** page of your [Auth0 application](https://manage.auth0.com/#/applications/) and add `https://localhost` to the **Allowed Origins (CORS)** field, leaving the old value in place. Once the migration is complete, you can safely remove the old value.
