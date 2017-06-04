import { Component } from '@angular/core';
import { AuthService } from '../lib/auth';
import { AppConfig } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private appName = AppConfig.AppName;

  constructor(private authService: AuthService) {
    // authentication needs to be handled on each request as per:
    // https://auth0.com/docs/quickstart/spa/angular2/02-custom-login
    this.authService.handleAuthentication();
  }
}
