import { Component, OnInit, OnDestroy } from '@angular/core';

import { BaseComponent } from '../base.component';
import { ComponentDependencyService } from '../component-dependency.service';
import { ComponentSetup } from '../component-setup.class';

@Component({
})
export abstract class BaseModuleComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
  }

  abstract setup(): ComponentSetup;

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
