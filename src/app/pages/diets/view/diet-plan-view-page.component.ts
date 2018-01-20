import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Diet } from '../../../models';
import { DietMenuItems } from '../menu.items';

@Component({
  templateUrl: 'diet-plan-view-page.component.html'
})
export class DietPlanViewPageComponent extends BasePageComponent implements OnInit {

  public dietId?: number;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies, activatedRoute);
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(
      this.activatedRoute.params.map(params => {
        this.dietId = +params['id'];
      })
    );
  }

  handleLoadDiet(diet: Diet): void {
    this.setConfig({
      menuItems: new DietMenuItems(diet.id).menuItems,
      menuTitle: {
        key: diet.dietName
      },
      componentTitle: {
        'key': 'module.diets.submenu.view'
      }
    });
  }
}
