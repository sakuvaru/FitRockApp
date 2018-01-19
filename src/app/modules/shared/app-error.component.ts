// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

// required by component
import { Log } from '../../models';
import { LogStatus } from 'lib/auth/models/log-status.enum';

@Component({
  templateUrl: 'app-error.component.html'
})
export class AppErrorComponent extends BasePageComponent implements OnInit {

  public isCriticalError: boolean = false;
  public showDebugDetails: boolean = false;
  public log?: Log;
  public translateParams: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.showDebugDetails = this.dependencies.coreServices.authService.getAuthenticationStatus() === LogStatus.Authenticated;

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
