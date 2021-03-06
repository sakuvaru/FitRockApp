import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AppConfig } from '../../../config';
import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
  templateUrl: 'server-down-page.component.html'
})
export class ServerDownPageComponent extends BasePageComponent implements OnInit {

  public appOnline: boolean = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies, activatedRoute);
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
