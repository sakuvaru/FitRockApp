// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

// required by component
import { Log } from '../../models';

@Component({
  templateUrl: 'app-error.component.html'
})
export class AppErrorComponent extends BaseComponent implements OnInit {

  public isCriticalError: boolean = false;
  public showDebugDetails: boolean = false;
  public log?: Log;
  public translateParams: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.showDebugDetails = this.dependencies.coreServices.authService.isAuthenticated();

    // get the guid of error from url
    const logGuid = this.activatedRoute.snapshot.queryParams[UrlConfig.AppErrorLogGuidQueryString];

    if (this.showDebugDetails && logGuid) {
      // try to get the error with details from service
      super.startGlobalLoader();

      this.dependencies.itemServices.logService
        .getLogByGuid(logGuid)
        .subscribe(response => {
          if (response.isEmpty()) {
            this.isCriticalError = true;
          } else {
            this.log = response.firstItem();
            this.translateParams = { 'guid': this.log ? this.log.guid : '' };
          }
          super.stopGlobalLoader();
        },
        (error) => {
          this.isCriticalError = true;
          super.stopGlobalLoader();
        });
    } else {
      // show critical error
      this.isCriticalError = true;
    }
  }
}
