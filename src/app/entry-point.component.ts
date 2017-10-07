import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, UrlConfig, ComponentSetup } from './core';
import { AuthenticatedUserService } from './core/services/authenticated-user.service';
import { AuthenticatedUser } from './core/models/core.models';

/**
 * User is redirected to this component from Auth0 (see AppConfig + UrlConfig)
 */
@Component({
  template: ''
})
export class EntryPointComponent extends BaseComponent {

  setup(): ComponentSetup | null {
    return null;
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)

    if (!this.dependencies.coreServices.authService.isAuthenticated()) {
      this.navigate([UrlConfig.getLoginUrl()]);
    }

    // get info about current user & redirect him based on that & store him in authenticated user service so that it can 
    // be easily accessed troughout the app
    this.dependencies.itemServices.userService
      .getAuthUser()
      .do(() => super.startGlobalLoader())
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
        super.stopGlobalLoader();

        let user = response.item;
        let authUser = new AuthenticatedUser(user.id, user.email, user.firstName, user.lastName, user.trainerUserId);

        // store user in authenticated user
        this.dependencies.authenticatedUserService.setUser(authUser);

        if (!response.item.isClient) {
          this.navigate([UrlConfig.TrainerMasterPath]);
        }
        else {
          this.navigate([UrlConfig.ClientMasterPath]);
        }
      },
      (error) => {
        this.navigateToError();
      })
  }
}
