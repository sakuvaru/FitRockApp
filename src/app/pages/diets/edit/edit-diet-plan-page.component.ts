import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Diet } from '../../../models';
import { DietMenuItems } from '../menu.items';

@Component({
  templateUrl: 'edit-diet-plan-page.component.html'
})
export class EditDietPlanPageComponent extends BasePageComponent implements OnInit, OnDestroy {

  public dietId?: number;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies, activatedRoute);
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(
      this.activatedRoute.params
      .map(params => {
        this.dietId = +params['id'];
      })
    );   
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
