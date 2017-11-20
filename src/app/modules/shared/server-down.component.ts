// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

// required
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'server-down.component.html'
})
export class ServerDownComponent extends BaseComponent implements OnInit {

  public appOnline: boolean = false;

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
    
    const delay = 15000; // every 15 sec.

    // check if server is available periodically
    Observable.timer(0, delay)
      .flatMap(() => this.dependencies.coreServices.repositoryClient.get(AppConfig.ServerCheckerController)
        .set()
        .map(response => this.appOnline = true)
        ._catch(err =>  Observable.of(true))) // catch error in order to keep subscriptions live
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
        // app is online, redirect back to main page
        if (this.appOnline) {
          super.navigateToMainPage();
        }
      },
      err => {
        // app still offline
        console.log('App offline - ' + new Date().toString());
      });
  }
}
