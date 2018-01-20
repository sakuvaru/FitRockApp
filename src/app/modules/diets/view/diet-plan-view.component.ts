import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Diet, DietFood } from '../../../models';

@Component({
  selector: 'mod-diet-plan-view',
  templateUrl: 'diet-plan-view.component.html'
})
export class DietPlanViewComponent extends BaseModuleComponent implements OnInit, OnChanges {

  @Input() dietId: number;

  @Output() loadDiet = new EventEmitter<Diet>();

  public diet: Diet;
  public sortedDietFoods: DietFood[];

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dietId) {
      super.subscribeToObservable(this.getDietObservable());
    }
  }

  private getDietObservable(): Observable<void> {
    return this.dependencies.itemServices.dietService.item()
      .byId(this.dietId)
      .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodCategory'])
      .get()
      .map(response => {
        this.loadDiet.next(response.item);

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
