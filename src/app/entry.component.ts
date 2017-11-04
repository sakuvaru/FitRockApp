import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, UrlConfig, ComponentSetup } from './core';
import { AuthenticatedUserService } from './core/services/authenticated-user.service';
import { AuthenticatedUser } from './core/models/core.models';
import { Observable } from 'rxjs/Rx';

@Component({
  template: '',
})
export class EntryComponent extends BaseComponent {

  setup(): ComponentSetup | null {
    return null;
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);

    console.log('ASEF');

    // if user is not authenticated, just redirect him to logon page
    if (!this.dependencies.coreServices.authService.isAuthenticated()) {
      this.navigate([UrlConfig.getLoginUrl()]);
      return;
    }

    // if authenticated user is stored locally, redirect him
    const localAuthUser = this.dependencies.authenticatedUserService.getUser();
    if (localAuthUser != null) {
      this.redirectUser(localAuthUser.isClient);
      return;
    }

    this.dependencies.coreServices.serverService.isAuthenticatedOnServer()
      .flatMap(authenticated => {
        if (authenticated) {

          // get info about current user & redirect him based on that & store him in authenticated user service so that it can 
          // be easily accessed troughout the app
          return this.dependencies.itemServices.userService
            .getAuthUser()
            .do(() => super.startGlobalLoader());

        } else {
          return Observable.of(null);
        }
      })
      .subscribe(response => {
        if (response == null) {
          // user is not authenticated
          // redirect him to logon screen
          this.navigate([UrlConfig.getLoginUrl()]);
        } else {
          // user is authenticated, update auth user
          const user = response.item;
          const authUser = new AuthenticatedUser(user.id, user.email, user.firstName, user.lastName, user.trainerUserId, user.isClient);

          // store user in authenticated user service
          this.dependencies.authenticatedUserService.setUser(authUser);

          this.redirectUser(user.isClient);
        }
      },
      (error) => {
        super.handleError(error);
      });
  }

  private redirectUser(isClient: boolean): void {
    if (!isClient) {
      this.navigate([UrlConfig.TrainerMasterPath]);
    } else {
      this.navigate([UrlConfig.ClientMasterPath]);
    }
  }
}
