import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

@Component({
  templateUrl: 'unauthorized-page.component.html'
})
export class UnauthorizedPageComponent extends BasePageComponent {

  public loginUrl: string;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);

    this.loginUrl = '/' + UrlConfig.getLoginUrl();
  }
}
