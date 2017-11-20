// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

@Component({
  selector: 'unauthorized',
  templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent extends BaseComponent {

  public loginUrl: string;

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
