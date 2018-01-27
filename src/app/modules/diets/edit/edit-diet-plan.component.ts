import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../lib/utilities';
import { AppConfig } from '../../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Diet, DietFood, Food } from '../../../models';
import { AddDietFoodDialogComponent } from '../dialogs/add-diet-food-dialog.component';
import { AddNewFoodDialogComponent } from '../dialogs/add-new-food-dialog.component';
import { EditDietFoodDialogComponent } from '../dialogs/edit-diet-food-dialog.component';
import { SelectDietFoodDialogComponent } from '../dialogs/select-diet-food-dialog.component';
import { LinearGaugeChart, GraphConfig } from 'web-components/graph';
import { WebColorEnum } from 'web-components';

@Component({
  templateUrl: 'edit-diet-plan.component.html',
  selector: 'mod-edit-diet-plan'
})
export class EditDietPlanComponent extends BaseModuleComponent implements OnDestroy, OnChanges, OnInit {

  @Output() loadDiet = new EventEmitter();

  @Input() dietId: number;

  private updateData$ = new EventEmitter<void>();

  public dietFoodNutritions?: any;

  public showFoodDetails: boolean = true;

  /**
   * Used on template to identify whether meals shows list of child foods
   */
  public openedMeals = {};

  public protColor = WebColorEnum.Blue;
  public fatColor = WebColorEnum.Red;
  public choColor = WebColorEnum.Purple;

  public diet?: Diet;
  public sortedDietFoods: DietFood[];

  public readonly dragulaBag: string = 'dragula-bag';
  public readonly dragulaHandle: string = 'dragula-move-handle';

  public fatsGauge?: GraphConfig<LinearGaugeChart>;
  public protGauge?: GraphConfig<LinearGaugeChart>;
  public choGauge?: GraphConfig<LinearGaugeChart>;

  public totalKca = 0;

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

    // subscribe to gauge changes
    this.subscribeToUpdateData();

    // subscribe to drop events
    super.subscribeToObservable(this.getInitObservable());
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

  openSelectFoodDialog(isFood: boolean, isMeal: boolean, isSupplement: boolean): void {
    const data: any = {};
    data.dietId = this.dietId;
    data.isFood = isFood;
    data.isMeal = isMeal;
    data.isSupplement = isSupplement;

    const dialog = this.dependencies.tdServices.dialogService.open(SelectDietFoodDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: data
    });

    dialog.afterClosed()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(m => {
        // open new add diet food dialog if some food was selected
        if (dialog.componentInstance.selectedFood) {
          this.openAddDietFoodDialog(dialog.componentInstance.selectedFood);
        } else if (dialog.componentInstance.openNewFoodDialog) {
          this.openNewFoodDialog(true, false, false);
        } else if (dialog.componentInstance.openNewMealDialog) {
          this.openNewFoodDialog(false, true, false);
        } else if (dialog.componentInstance.openNewSupplementDialog) {
          this.openNewFoodDialog(false, false, true);
        }
      });
  }

  openNewFoodDialog(isFood: boolean, isMeal: boolean, isSupplement: boolean): void {
    const dialog = this.dependencies.tdServices.dialogService.open(AddNewFoodDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: {
        isFood: isFood,
        isMeal: isMeal,
        isSupplement: isSupplement
      }
    });
    dialog.afterClosed()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(m => {
        // open add diet food dialog if new custom food was created 
        if (dialog.componentInstance.newFood) {
          this.openAddDietFoodDialog(dialog.componentInstance.newFood);
        }
      });
  }

  openAddDietFoodDialog(food: Food): void {
    const data: any = {};
    data.dietId = this.dietId;
    data.food = food;

    const dialog = this.dependencies.tdServices.dialogService.open(AddDietFoodDialogComponent, {
      data: data,
      panelClass: AppConfig.DefaultDialogPanelClass
    });

    dialog.afterClosed()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(m => {
        // add newly added diet food to current list
        // but first load whole object with category
        if (dialog.componentInstance.newDietFood) {
          this.dependencies.itemServices.dietFoodService.item().byId(dialog.componentInstance.newDietFood.id)
            .includeMultiple(['Food', 'Food.FoodCategory', 'Food.FoodUnit'])
            .get()
            .subscribe(response => {
              this.sortedDietFoods.push(response.item);
              this.updateData();
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
          this.updateData();
          this.showSavedSnackbar();
          this.stopGlobalLoader();
        }));
  }

  openEditDietFoodDialog(dietFood: DietFood): void {
    const dialog = this.dependencies.tdServices.dialogService.open(EditDietFoodDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: dietFood
    });

    dialog.afterClosed().subscribe(m => {
      if (dialog.componentInstance.dietFoodWasDeleted || dialog.componentInstance.foodWasEdited) {
        // recalculate gauges if there were any changes
        this.updateData();
      }

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

  private calculateDietFoodNutrition(dietFoods: DietFood[]): void {
    if (!dietFoods) {
      return;
    }

    const data = {};
    dietFoods.forEach(dietFood => {
      data[dietFood.id] = this.dependencies.itemServices.foodService.calculateFoodWithAmount(dietFood.food, dietFood.amount, 1);
    });
    
    this.dietFoodNutritions = data;
  }

  private subscribeToUpdateData(): void {
    this.updateData$
      .switchMap(() => this.getDietObservable(this.dietId))
      .map(() => {
        if (this.diet) {
          this.calculateGauges(this.diet);
        }
        this.calculateDietFoodNutrition(this.sortedDietFoods);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe();
  }

  private updateData(): void {
    this.updateData$.next();
  }

  private calculateGauges(diet: Diet): void {
    if (!diet) {
      return;
    }

    const nutrition = this.dependencies.itemServices.dietService.aggregateNutrition(diet, 1);

    if (diet.targetFat) {
      this.fatsGauge = this.dependencies.webComponentServices.graphService.linearGaugeChart(Observable.of(
        new LinearGaugeChart(0, diet.targetFat + (diet.targetFat * 0.3), nutrition.fat, {
          previousValue: diet.targetFat,
          units: super.translate('module.foods.nutrition.fat'),
          color: this.dependencies.itemServices.dietService.getGaugeColor(diet.targetFat, nutrition.fat),
          labelFormatting: (value) => `${value} / ${diet.targetFat}`
        })), {
          height: '75px'
        }).build();
    }
    if (diet.targetCho) {
      this.choGauge = this.dependencies.webComponentServices.graphService.linearGaugeChart(Observable.of(
        new LinearGaugeChart(0, diet.targetCho + (diet.targetCho * 0.3), nutrition.cho, {
          previousValue: diet.targetCho,
          units: super.translate('module.foods.nutrition.choShort'),
          color: this.dependencies.itemServices.dietService.getGaugeColor(diet.targetCho, nutrition.cho),
          labelFormatting: (value) => `${value} / ${diet.targetCho}`
        })), {
          height: '75px'
        }).build();
    }
    if (diet.targetProt) {
      this.protGauge = this.dependencies.webComponentServices.graphService.linearGaugeChart(Observable.of(
        new LinearGaugeChart(0, diet.targetProt + (diet.targetProt * 0.3), nutrition.prot, {
          previousValue: diet.targetProt,
          units: super.translate('module.foods.nutrition.prot'),
          color: this.dependencies.itemServices.dietService.getGaugeColor(diet.targetProt, nutrition.prot),
          labelFormatting: (value) => `${value} / ${diet.targetProt}`
        })), {
          height: '75px'
        }).build();
    }
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

  private getInitObservable(): Observable<void> {
    return this.dragulaService.drop
      .takeUntil(this.ngUnsubscribe)
      .do(() => {
        super.startGlobalLoader();
      })
      .debounceTime(500)
      .switchMap(() => {
        return this.dependencies.itemServices.dietFoodService.updateItemsOrder(this.sortedDietFoods, this.dietId).set();
      })
      .map(() => {
        super.stopGlobalLoader();
        super.showSavedSnackbar();
      });
  }

  private getDietObservable(dietId: number): Observable<void> {
    return this.dependencies.itemServices.dietService.item()
      .byId(dietId)
      .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food',
        'DietFoods.Food.FoodCategory', 'DietFoods.Food.ChildFoods', 'DietFoods.Food.ChildFoods.Food', 'DietFoods.Food.ChildFoods.Food.FoodUnit'])
      .get()
      .map(response => {
        console.log(response);
        this.loadDiet.next(response.item);
        this.calculateGauges(response.item);
        this.calculateDietFoodNutrition(response.item.dietFoods);
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
