// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Diet, DietFood, Food } from '../../../models';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Rx';
import { CacheKeyType } from '../../../../lib/repository';
import { stringHelper } from '../../../../lib/utilities';
import { SelectDietFoodDialogComponent } from '../dialogs/select-diet-food-dialog.component';
import { EditDietFoodDialogComponent } from '../dialogs/edit-diet-food-dialog.component';
import { AddCustomFoodDialogComponent } from '../dialogs/add-custom-food-dialog.component';
import { AddDietFoodDialogComponent } from '../dialogs/add-diet-food-dialog.component';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-diet-plan-export.component.html',
  selector: 'edit-diet-plan-export'
})
export class EditDietPlanExportComponent extends BaseComponent implements OnDestroy, OnChanges {

  @Output() loadDiet = new EventEmitter();

  @Input() dietId: number;

  private diet: Diet;
  private sortedDietFoods: DietFood[];

  private readonly dragulaBag: string = 'dragula-bag';
  private readonly dragulaHandle: string = 'dragula-move-handle';

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);

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

  setup(): ComponentSetup | null {
    return null;
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

  private getInitObsevable(): Observable<any> {
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

  private deleteDietFood(dietFood: DietFood): void {
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
          super.handleError(error);
          this.stopGlobalLoader();
        }));
  }

  private openDietFoodDialog(dietFood: DietFood): void {
    const dialog = this.dependencies.tdServices.dialogService.open(EditDietFoodDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
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
        dietFoodToUpdate[0].unitValue = dialog.componentInstance.dietFood.unitValue;
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

  private openSelectFoodDialog(): void {
    const data: any = {};
    data.dietId = this.diet.id;

    const dialog = this.dependencies.tdServices.dialogService.open(SelectDietFoodDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: data
    });

    dialog.afterClosed().subscribe(m => {
      // open new add diet food dialog if some food was selected
      if (dialog.componentInstance.selectedFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.selectedFood);
      } else if (dialog.componentInstance.openAddCustomFoodDialog) {
        this.openAddCustomFoodDialog();
      }
    });
  }

  private openAddCustomFoodDialog(): void {
    const dialog = this.dependencies.tdServices.dialogService.open(AddCustomFoodDialogComponent, {
      width: AppConfig.DefaultDialogWidth
    });

    dialog.afterClosed().subscribe(m => {
      // open add diet food dialog if new custom food was created 
      if (dialog.componentInstance.newFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.newFood);
      }
    });
  }

  private openAddDietFoodDialog(food: Food): void {
    const data: any = {};
    data.dietId = this.diet.id;
    data.food = food;

    const dialog = this.dependencies.tdServices.dialogService.open(AddDietFoodDialogComponent, {
      data: data,
      width: AppConfig.DefaultDialogWidth
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
}
