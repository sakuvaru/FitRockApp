import { Component } from '@angular/core';

import { ComponentDependencyService, ComponentSetup } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }
}
