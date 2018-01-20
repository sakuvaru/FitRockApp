import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
  templateUrl: 'item-not-found-page.component.html'
})
export class ItemNotFoundPageComponent extends BasePageComponent {
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies, activatedRoute);
  }
}
