// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';

@Component({
  templateUrl: '404.component.html'
})
export class Global404Component extends BaseComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }
}
