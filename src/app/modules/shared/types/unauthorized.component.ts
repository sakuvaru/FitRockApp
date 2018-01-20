import { Component } from '@angular/core';

import { UrlConfig } from '../../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
  selector: 'mod-unauthorized',
  templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent extends BaseModuleComponent {

  public loginUrl: string;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);

    this.loginUrl = '/' + UrlConfig.getLoginUrl();
  }
}
