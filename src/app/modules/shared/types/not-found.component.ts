import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
  selector: 'mod-not-found',
  templateUrl: 'not-found.component.html'
})
export class NotFoundComponent extends BaseModuleComponent {
  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }
}
