import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../services/auth/auth.service';
import Auth0Cordova from '../../../../dist';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AuthApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private auth: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      function intentHandler(url) {
          setTimeout(function (){
            Auth0Cordova.onRedirectUri(url);
          }, 4);
      }

      window['handleOpenURL'] = intentHandler;

      // Schedule a token refresh on app start up
      auth.startupTokenRefresh();
    });
  }
}
