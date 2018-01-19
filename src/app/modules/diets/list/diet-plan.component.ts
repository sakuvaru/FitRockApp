import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Diet, DietFood } from '../../../models';
import { DietMenuItems } from '../menu.items';

@Component({
  templateUrl: 'diet-plan.component.html'
})
export class DietPlanComponent extends BasePageComponent implements OnInit {

  public diet: Diet;
  public sortedDietFoods: DietFood[];

  constructor(
    protected activatedRoute: ActivatedRoute,
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

    super.subscribeToObservable(this.getDietObservable());
  }

  private getDietObservable(): Observable<any> {
    return this.activatedRoute.params
      .switchMap((params: Params) => this.dependencies.itemServices.dietService.item()
        .byId(+params['id'])
        .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodCategory'])
        .get())
      .map(response => {
        this.setConfig({
          menuItems: new DietMenuItems(response.item.id).menuItems,
          menuTitle: {
            key: response.item.dietName
          },
          componentTitle: {
            'key': 'module.diets.submenu.view'
          }
        });

        this.assignDiet(response.item);
      });
  }

  private assignDiet(diet: Diet): void {
    // assign diet after all forms are ready and loaded + order exercises
    diet.dietFoods.sort((n1, n2) => n1.order - n2.order);

    this.sortedDietFoods = this.sortedDietFoods = diet.dietFoods.sort((n1, n2) => n1.order - n2.order);

    this.diet = diet;
  }
}
