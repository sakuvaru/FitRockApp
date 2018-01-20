import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UrlConfig } from '../../../config';
import { BasePageComponent, ComponentDependencyService } from '../../../core';

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
