import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
  templateUrl: 'not-found-page.component.html'
})
export class NotFoundPageComponent extends BasePageComponent {
  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }
}
