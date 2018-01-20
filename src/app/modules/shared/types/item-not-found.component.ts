import { Component } from '@angular/core';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
  selector: 'mod-item-not-found',
  templateUrl: 'item-not-found.component.html'
})
export class ItemNotFoundComponent extends BaseModuleComponent {
  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

}
