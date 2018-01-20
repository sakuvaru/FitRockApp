import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppConfig } from '../../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
  selector: 'mod-server-down',
  templateUrl: 'server-down.component.html'
})
export class ServerDownComponent extends BaseModuleComponent implements OnInit {

  public appOnline: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {

    const delay = 15000; // every 15 sec.

    // check if server is available periodically
    Observable.timer(0, delay)
      .flatMap(() => this.dependencies.coreServices.repositoryClient.get(AppConfig.ServerCheckerController)
        .set()
        .map(response => this.appOnline = true)
        ._catch(err => Observable.of(true))) // catch error in order to keep subscriptions live
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
        // app is online, redirect back to main page
        if (this.appOnline) {
          this.dependencies.coreServices.navigateService.entryPage().navigate();
        }
      },
      err => {
        // app still offline
        console.log('App offline - ' + new Date().toString());
      });
  }
}
