import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, UrlConfig } from './core';

/**
 * User is redirected to this component from Auth0 (see AppConfig + UrlConfig)
 */
@Component({
    template: ''
})
export class EntryPointComponent extends BaseComponent{
  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)

    if (!this.dependencies.coreServices.authService.isAuthenticated()){
      this.navigate([UrlConfig.getLoginUrl()]);
    }

    // get info about current user & redirect him based on that
    this.dependencies.authUser
      .do(() => super.startGlobalLoader())
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        super.stopGlobalLoader();
        
        if (!user.isClient) {
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
