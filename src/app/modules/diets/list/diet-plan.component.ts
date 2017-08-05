// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DietMenuItems } from '../menu.items';
import { Diet, DietFood } from '../../../models';

@Component({
  templateUrl: 'diet-plan.component.html'
})
export class DietPlanComponent extends BaseComponent implements OnInit {

  private diet: Diet;
  private sortedDietFoods: DietFood[];

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    super.startLoader();

    this.initDiet();
  }

  private initDiet(): void {
    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .switchMap((params: Params) => this.dependencies.itemServices.dietService.item()
        .byId(+params['id'])
        .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodCategory'])
        .get())
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
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
        super.stopLoader();
      },
      error => super.handleError(error));
  }

  private assignDiet(diet: Diet): void {
    // assign diet after all forms are ready and loaded + order exercises
    diet.dietFoods.sort((n1, n2) => n1.order - n2.order);

    this.sortedDietFoods = this.sortedDietFoods = diet.dietFoods.sort((n1, n2) => n1.order - n2.order);

    this.diet = diet;
  }
}