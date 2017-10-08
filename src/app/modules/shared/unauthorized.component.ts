// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UrlConfig, AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';

@Component({
  selector: 'unauthorized',
  templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent extends BaseComponent {

  private loginUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);

    this.loginUrl = '/' + UrlConfig.getLoginUrl();
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
  }
}
