import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, UrlConfig, ComponentSetup } from './core';
import { AuthenticatedUserService } from './core/services/authenticated-user.service';
import { AuthenticatedUser } from './core/models/core.models';
import { Observable } from 'rxjs/Rx';

/**
 * User is redirected to this component from Auth0 (see AppConfig + UrlConfig)
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends BaseComponent {

  setup(): ComponentSetup | null {
    return null;
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
  }
}
