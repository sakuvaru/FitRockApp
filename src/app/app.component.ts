import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from '../lib/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent {
  private appName = AppConfig.AppName;

  constructor(
    protected dependencies: ComponentDependencyService,
    private authService: AuthService
  ) {
    super(dependencies)
  }

  initAppData(): AppData {
    return new AppData({
      subTitle: "Main"
    });
  }
}
