import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from './core';
import { AuthenticatedUserService } from './core/services/authenticated-user.service';
import { AuthenticatedUser } from './core/models/core.models';
import { Observable } from 'rxjs/Rx';
import { AppConfig, UrlConfig } from './config';

@Component({
  template: '',
})
export class EntryComponent extends BaseComponent {

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);

    // try getting current user out of the auth service
    const currentUser = this.dependencies.coreServices.authService.getCurrentUser();

    // if user is not authenticated, just redirect him to logon page
    if (!currentUser) {
      this.navigate([UrlConfig.getLoginUrl()]);
      return;
    }

    // save user's gravatar and then user 
    this.dependencies.itemServices.userService
      .saveUserLoginData(currentUser.picture, currentUser.firstName, currentUser.lastName, currentUser.isFemale)
      .do(() => super.startGlobalLoader())
      .flatMap(userGravatarResponse => {
        return this.dependencies.itemServices.userService
          .getAuthUser()
          .map(response => {
            if (response == null) {
              // invalid response
              throw Error('Invalid user response from server, please report this error');
            } else if (!response.item) {
              // redirect him to logon screen
              this.navigate([UrlConfig.getLoginUrl()]);
            } else {
              // user is authenticated, update auth user
              const user = response.item;
              const authUser = new AuthenticatedUser(
                user.id,
                user.email,
                user.firstName,
                user.lastName,
                user.trainerUserId,
                user.isClient,
                user.avatarUrl,
                user.language,
                currentUser.picture, // this is the gravatar url
                user.licenseString
              );

              // store user in authenticated user service
              this.dependencies.authenticatedUserService.setUser(authUser);

              // store user language ui preference
              this.dependencies.coreServices.currentLanguageService.setLanguage(authUser.language);

              // redirect user
              this.redirectUser(user.isClient);
            }
          });
      }).subscribe(() => undefined,
      (error) => {
        super.handleAppError(error);
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
