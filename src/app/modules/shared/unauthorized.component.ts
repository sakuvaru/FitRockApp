// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

@Component({
  selector: 'unauthorized',
  templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent extends BasePageComponent {

  public loginUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);

    this.loginUrl = '/' + UrlConfig.getLoginUrl();
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }
}
