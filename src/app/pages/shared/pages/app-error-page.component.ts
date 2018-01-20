import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogStatus } from 'lib/auth/models/log-status.enum';

import { UrlConfig } from '../../../config';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Log } from '../../../models';

@Component({
  templateUrl: 'app-error-page.component.html'
})
export class AppErrorPageComponent extends BasePageComponent implements OnInit {

  public isCriticalError: boolean = false;
  public showDebugDetails: boolean = false;
  public log?: Log;
  public translateParams: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
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
