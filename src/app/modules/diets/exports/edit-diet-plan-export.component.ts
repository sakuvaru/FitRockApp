// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { Diet, DietFood, Food } from '../../../models';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Rx';
import { CacheKeyType } from '../../../../lib/repository';
import { StringHelper } from '../../../../lib/utilities';
import { SelectDietFoodDialogComponent } from '../dialogs/select-diet-food-dialog.component';
import { EditDietFoodDialogComponent } from '../dialogs/edit-diet-food-dialog.component';
import { AddCustomFoodDialogComponent } from '../dialogs/add-custom-food-dialog.component';
import { AddDietFoodDialogComponent } from '../dialogs/add-diet-food-dialog.component';
import * as _ from 'underscore';

@Component({
  templateUrl: 'edit-diet-plan-export.component.html',
  selector: 'edit-diet-plan-export'
})
export class EditDietPlanExportComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {

  @Output() loadDiet = new EventEmitter();

  @Input() dietId: number;

  private diet: Diet;
  private sortedDietFoods: DietFood[];

  /**
  * Drop subscription for dragula - Unsubscribe on OnDestroy + destroy dragula itself!
  */
  private dropSubscription: Subscription;

  private dragulaBag: string = 'dragula-bag';

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.startLoader();

    // set handle for dragula
    this.dragulaService.setOptions(this.dragulaBag, {
      moves: function (el: any, container: any, handle: any): any {
        return StringHelper.contains(handle.className, 'dragula-move-handle');
      }
    });

    // subscribe to drop events
    this.dropSubscription = this.dragulaService.drop
      .do(() => this.startGlobalLoader())
      .debounceTime(500)
      .switchMap(() => {
        return this.dependencies.itemServices.dietFoodService.updateItemsOrder(this.sortedDietFoods, this.diet.id).set();
      })
      .subscribe(() => {
        super.stopGlobalLoader();
        super.showSavedSnackbar();
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    // unsubscribe from dragula drop events
    this.dropSubscription.unsubscribe();
    this.dragulaService.destroy(this.dragulaBag);
  }

  ngOnChanges(changes: SimpleChanges) {
    var dietId = changes.dietId.currentValue;
    if (dietId) {
      this.initDiet(dietId)
    }
  }

  private initDiet(dietId: number): void {
    this.dependencies.itemServices.dietService.item()
      .byId(dietId)
      .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodCategory'])
      .get()
      .subscribe(response => {
        this.loadDiet.next(response.item);

        this.assignDiet(response.item);
        this.stopLoader();
      });
  }

  private assignDiet(diet: Diet): void {
    // assign diet after all forms are ready and loaded + after ordering foods
    diet.dietFoods.sort((n1, n2) => n1.order - n2.order);
    this.sortedDietFoods = diet.dietFoods = diet.dietFoods.sort((n1, n2) => n1.order - n2.order);
    this.diet = diet;
  }

  private deleteDietFood(dietFood: DietFood): void {
    this.startGlobalLoader();
    this.dependencies.itemServices.dietFoodService.delete(dietFood.id)
      .set()
      .do(() => this.startGlobalLoader())
      .subscribe(response => {
        // remove diet food from local variable
        this.sortedDietFoods = _.reject(this.sortedDietFoods, function (item) { return item.id === response.deletedItemId; });

        this.showSavedSnackbar();

        this.stopGlobalLoader();
      },
      (error) => {
        super.handleError(error);
        this.stopGlobalLoader();
      });
  }

  private openDietFoodDialog(dietFood: DietFood): void {
    var dialog = this.dependencies.tdServices.dialogService.open(EditDietFoodDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: dietFood
    });

    dialog.afterClosed().subscribe(m => {
      // update || remove diet food from local variable
      if (dialog.componentInstance.dietFoodWasDeleted) {
        // remove diet food
        this.sortedDietFoods = _.reject(this.sortedDietFoods, function (item) { return item.id === dialog.componentInstance.idOfDeletedDietFood; });

        // recalculate order
        this.recalculateOrder();
      }
      else {
        // update diet food with updated data
        var dietFoodToUpdate: DietFood[] = this.sortedDietFoods.filter(m => m.id === dietFood.id);

        if (!dietFoodToUpdate) {
          throw Error(`Cannot update diet with new values from saved form`);
        }

        // update data
        dietFoodToUpdate[0].unitValue = dialog.componentInstance.dietFood.unitValue;
        dietFoodToUpdate[0].eatTime = dialog.componentInstance.dietFood.eatTime;
        dietFoodToUpdate[0].notes = dialog.componentInstance.dietFood.notes;
      }
    })
  }

  private recalculateOrder(): void{
    if (this.sortedDietFoods){
      var order = 0;
      this.sortedDietFoods.forEach(dietFood => {
        dietFood.order = order;
        order++;
      })
    }
  }

  private openSelectFoodDialog(): void {
    var data: any = {};
    data.dietId = this.diet.id;

    var dialog = this.dependencies.tdServices.dialogService.open(SelectDietFoodDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: data
    });

    dialog.afterClosed().subscribe(m => {
      // open new add diet food dialog if some food was selected
      if (dialog.componentInstance.selectedFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.selectedFood);
      }
      // or open new custom food dialog
      else if (dialog.componentInstance.openAddCustomFoodDialog) {
        this.openAddCustomFoodDialog();
      }
    })
  }

  private openAddCustomFoodDialog(): void {
    var dialog = this.dependencies.tdServices.dialogService.open(AddCustomFoodDialogComponent, {
      width: AppConfig.DefaultDialogWidth
    });

    dialog.afterClosed().subscribe(m => {
      // open add diet food dialog if new custom food was created 
      if (dialog.componentInstance.newFood) {
        this.openAddDietFoodDialog(dialog.componentInstance.newFood);
      }
    })
  }

  private openAddDietFoodDialog(food: Food): void {
    var data: any = {};
    data.dietId = this.diet.id;
    data.food = food;

    var dialog = this.dependencies.tdServices.dialogService.open(AddDietFoodDialogComponent, {
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
          })
      }
    })
  }
}