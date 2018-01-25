import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../lib/utilities';
import { AppConfig } from '../../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Diet, DietFood, Food } from '../../../models';
import { AddDietFoodDialogComponent } from '../dialogs/add-diet-food-dialog.component';
import { AddNewDishDialogComponent } from '../dialogs/add-new-dish-dialog.component';
import { AddNewFoodDialogComponent } from '../dialogs/add-new-food-dialog.component';
import { EditDietFoodDialogComponent } from '../dialogs/edit-diet-food-dialog.component';
import { SelectDietFoodDialogComponent } from '../dialogs/select-diet-food-dialog.component';

@Component({
  templateUrl: 'edit-diet-plan.component.html',
  selector: 'mod-edit-diet-plan'
})
export class EditDietPlanComponent extends BaseModuleComponent implements OnDestroy, OnChanges, OnInit {

  @Output() loadDiet = new EventEmitter();

  @Input() dietId: number;

  public diet: Diet;
  public sortedDietFoods: DietFood[];

  public readonly dragulaBag: string = 'dragula-bag';
  public readonly dragulaHandle: string = 'dragula-move-handle';

  constructor(
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit(): void {
    // make sure dragula does not already exist
    const existingDragula = this.dragulaService.find(this.dragulaBag);
    if (existingDragula) {
      // destroy dragula because it should not exist
      // this can happen id ngOnDestroy was not called 
      // which may happen if e.g. recompile is triggered 
      this.dragulaService.destroy(this.dragulaBag);
    }

    // set handle for dragula
    const that = this;
    this.dragulaService.setOptions(this.dragulaBag, {
      moves: function (el: any, container: any, handle: any): any {
        return stringHelper.contains(el.className, that.dragulaHandle);
      }
    });

    // subscribe to drop events
    super.subscribeToObservable(this.getInitObsevable());
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    // unsubscribe from dragula drop events
    this.dragulaService.destroy(this.dragulaBag);
  }

  ngOnChanges(changes: SimpleChanges) {
    const dietId = changes.dietId.currentValue;
    if (dietId) {
      super.subscribeToObservable(this.getDietObservable(dietId));
    }
  }

  openSelectFoodDialog(foods: boolean, meals: boolean, supplements: boolean): void {
    const data: any = {};
    data.dietId = this.diet.id;
    data.foods = foods;
    data.meals = meals;
    data.supplements = supplements;

    const dialog = this.dependencies.tdServices.dialogService.open(SelectDietFoodDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: data
    });

    dialog.afterClosed().subscribe(m => {
      // open new add diet food dialog if some food was selected
      if (dialog.componentInstance.selectedFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.selectedFood);
      } else if (dialog.componentInstance.openAddNewFoodDialog) {
        this.openNewFoodDialog();
      } else if (dialog.componentInstance.openAddNewDishDialog) {
        this.openNewDishDialog();
      }
    });
  }

  openNewDishDialog(): void {
    const dialog = this.dependencies.tdServices.dialogService.open(AddNewDishDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass
    });

    dialog.afterClosed().subscribe(m => {
      // open add diet food dialog if new custom food was created 
      if (dialog.componentInstance.newFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.newFood);
      }
    });
  }

  openNewFoodDialog(): void {
    const dialog = this.dependencies.tdServices.dialogService.open(AddNewFoodDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass
    });
    dialog.afterClosed().subscribe(m => {
      // open add diet food dialog if new custom food was created 
      if (dialog.componentInstance.newFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.newFood);
      }
    });
  }

  openAddDietFoodDialog(food: Food): void {
    const data: any = {};
    data.dietId = this.diet.id;
    data.food = food;

    const dialog = this.dependencies.tdServices.dialogService.open(AddDietFoodDialogComponent, {
      data: data,
      panelClass: AppConfig.DefaultDialogPanelClass
    });

    dialog.afterClosed().subscribe(m => {
      // add newly added diet food to current list
      // but first load whole object with category
      if (dialog.componentInstance.newDietFood) {
        this.dependencies.itemServices.dietFoodService.item().byId(dialog.componentInstance.newDietFood.id)
          .includeMultiple(['Food', 'Food.FoodCategory', 'Food.FoodUnit'])
          .get()
          .subscribe(response => {
            this.sortedDietFoods.push(response.item);
          });
      }
    });
  }

  deleteDietFood(dietFood: DietFood): void {
    super.subscribeToObservable(
      this.dependencies.itemServices.dietFoodService.delete(dietFood.id)
        .set()
        .do(() => this.startGlobalLoader())
        .map(response => {
          // remove diet food from local letiable
          this.sortedDietFoods = _.reject(this.sortedDietFoods, function (item) { return item.id === response.deletedItemId; });

          this.showSavedSnackbar();

          this.stopGlobalLoader();
        },
        (error) => {
          this.stopGlobalLoader();
        }));
  }

  openDietFoodDialog(dietFood: DietFood): void {
    const dialog = this.dependencies.tdServices.dialogService.open(EditDietFoodDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: dietFood
    });

    dialog.afterClosed().subscribe(m => {
      // update || remove diet food from local letiable
      if (dialog.componentInstance.dietFoodWasDeleted) {
        // remove diet food
        this.sortedDietFoods = _.reject(this.sortedDietFoods, function (item) { return item.id === dialog.componentInstance.idOfDeletedDietFood; });

        // recalculate order
        this.recalculateOrder();
      } else {
        // update diet food with updated data
        const dietFoodToUpdate: DietFood[] = this.sortedDietFoods.filter(s => s.id === dietFood.id);

        if (!dietFoodToUpdate) {
          throw Error(`Cannot update diet with new values from saved form`);
        }

        // update data
        dietFoodToUpdate[0].amount = dialog.componentInstance.dietFood.amount;
        dietFoodToUpdate[0].eatTime = dialog.componentInstance.dietFood.eatTime;
        dietFoodToUpdate[0].notes = dialog.componentInstance.dietFood.notes;
      }
    });
  }

  private recalculateOrder(): void {
    if (this.sortedDietFoods) {
      let order = 0;
      this.sortedDietFoods.forEach(dietFood => {
        dietFood.order = order;
        order++;
      });
    }
  }

  private getInitObsevable(): Observable<void> {
    return this.dragulaService.drop
      .takeUntil(this.ngUnsubscribe)
      .do(() => {
        super.startGlobalLoader();
      })
      .debounceTime(500)
      .switchMap(() => {
        return this.dependencies.itemServices.dietFoodService.updateItemsOrder(this.sortedDietFoods, this.diet.id).set();
      })
      .map(() => {
        super.stopGlobalLoader();
        super.showSavedSnackbar();
      });
  }

  private getDietObservable(dietId: number): Observable<any> {
    return this.dependencies.itemServices.dietService.item()
      .byId(dietId)
      .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodCategory'])
      .get()
      .map(response => {
        this.loadDiet.next(response.item);

        this.assignDiet(response.item);
      });
  }

  private assignDiet(diet: Diet): void {
    // assign diet after all forms are ready and loaded + after ordering foods
    diet.dietFoods.sort((n1, n2) => n1.order - n2.order);
    this.sortedDietFoods = diet.dietFoods = diet.dietFoods.sort((n1, n2) => n1.order - n2.order);
    this.diet = diet;
  }
}
