// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';

@Component({
  templateUrl: 'server-down.component.html'
})
export class ServerDownComponent extends BaseComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
  }
}
