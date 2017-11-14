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

  setup(): ComponentSetup | null {
    return null;
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);

    // if user is not authenticated, just redirect him to logon page
    if (!this.dependencies.coreServices.authService.isAuthenticated()) {
      this.navigate([UrlConfig.getLoginUrl()]);
      return;
    }

    this.dependencies.itemServices.userService
      .getAuthUser()
      .do(() => super.startGlobalLoader())
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
        if (response == null) {
          // invalid response
          throw Error('Invalid user response from server, please report this error');
        } else if (!response.item) {
           // redirect him to logon screen
           this.navigate([UrlConfig.getLoginUrl()]);
        } else {
          // user is authenticated, update auth user
          const user = response.item;
          const authUser = new AuthenticatedUser(user.id, user.email, user.firstName, user.lastName, user.trainerUserId, user.isClient, user.avatarUrl, user.language);

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
