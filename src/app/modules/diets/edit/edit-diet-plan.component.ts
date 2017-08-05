// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DietMenuItems } from '../menu.items';
import { Diet } from '../../../models';

@Component({
  templateUrl: 'edit-diet-plan.component.html'
})
export class EditDietPlan extends BaseComponent implements OnInit, OnDestroy {

  private dietId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.dietId = +params['id'];
      });
  }

  private handleLoadDiet(diet: Diet): void {
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