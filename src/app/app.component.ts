import { Component } from '@angular/core';

import { ComponentDependencyService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
  }
}
