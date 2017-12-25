// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DietMenuItems } from '../menu.items';
import { Diet } from '../../../models';

@Component({
  templateUrl: 'edit-diet-plan.component.html'
})
export class EditDietPlanComponent extends BaseComponent implements OnInit, OnDestroy {

  public dietId: number;

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
  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.dietId = +params['id'];
      });
  }

  public handleLoadDiet(diet: Diet): void {
    this.setConfig({
      menuItems: new DietMenuItems(diet.id).menuItems,
      menuTitle: {
        key: diet.dietName
      },
      componentTitle: {
        'key': 'module.diets.editTemplate'
      }
    });
  }
}
