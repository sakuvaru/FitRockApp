import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, UrlConfig, ComponentSetup } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)
  }

  setup(): ComponentSetup | null {
    return null;
  }
}
