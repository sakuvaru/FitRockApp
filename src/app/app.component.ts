import { Component } from '@angular/core';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from './core';

/**
 * User is redirected to this component from Auth0 (see AppConfig + UrlConfig)
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  setup(): ComponentSetup | null {
    return null;
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
  }
}
