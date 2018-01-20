import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LogStatus } from 'lib/auth/models/log-status.enum';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Log } from '../../../models';

@Component({
  selector: 'mod-app-error',
  templateUrl: 'app-error.component.html'
})
export class AppErrorComponent extends BaseModuleComponent implements OnInit, OnChanges {

  @Input() logGuid: string;

  public isCriticalError: boolean = false;
  public showDebugDetails: boolean = false;
  public log?: Log;
  public translateParams: any;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.logGuid) {
      this.init();
    }
  }

  private init(): void {
    this.showDebugDetails = this.dependencies.coreServices.authService.getAuthenticationStatus() === LogStatus.Authenticated;

    if (this.showDebugDetails && this.logGuid) {
      // try to get the error with details from service
      super.startGlobalLoader();

      this.dependencies.itemServices.logService
        .getLogByGuid(this.logGuid)
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
