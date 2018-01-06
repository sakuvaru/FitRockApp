import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from 'app/config';
import { Food, FoodDish, NewChildFoodVirtualModel } from 'app/models';
import { stringHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { guidHelper } from '../../../../lib/utilities';
import { DataFormConfig, DataFormMultipleChoiceItem } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { SelectFoodDialogComponent } from '../dialogs/select-food-dialog.component';
import { DishMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-dish.component.html'
})
export class EditDishComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    public dishValueChange: Subject<DataFormMultipleChoiceItem<NewChildFoodVirtualModel>> = new Subject<DataFormMultipleChoiceItem<NewChildFoodVirtualModel>>();

    private item: Food;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private getFoodOptionMetaLines(food: Food, amount: number): Observable<string>[] {
        return [
            this.dependencies.coreServices.localizationHelperService.translateFoodAmountAndUnit(
                amount,
                food.foodUnit.unitCode
            ),
            this.dependencies.coreServices.localizationHelperService.translateFoodComposition(
                food.prot,
                food.fat,
                food.cho,
                food.kcal)
        ];
    }

    private createVirtualFoodOption(food: Food, amount: number): DataFormMultipleChoiceItem<NewChildFoodVirtualModel> {
        const virtualModel = new NewChildFoodVirtualModel(food.id, amount);

        return new DataFormMultipleChoiceItem(
            guidHelper.newGuid(),
            virtualModel,
            Observable.of(food.foodName),
            this.getFoodOptionMetaLines(food, amount)
        );
    }

    private getMultipleChoiceFoodOption(dish: FoodDish): DataFormMultipleChoiceItem<NewChildFoodVirtualModel> {
        return new DataFormMultipleChoiceItem(
            dish.id.toString(),
            dish,
            Observable.of(dish.food.foodName),
            this.getFoodOptionMetaLines(dish.food, dish.amount)
        );
    }

    private openSelectFoodDialog(): void {
        const data: any = {};

        const dialog = this.dependencies.tdServices.dialogService.open(SelectFoodDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.selectedFood) {
                this.dishValueChange.next(
                    this.createVirtualFoodOption(dialog.componentInstance.selectedFood, 99)
                );
            }
        });
    }

    private initForm(): void {
        this.activatedRoute.params
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.foodService.buildEditForm(
                    this.dependencies.itemServices.foodService.editFormQuery(+params['id'])
                        .includeMultiple(['ChildFoods', 'ChildFoods.Food', 'ChildFoods.Food.FoodUnit'])
                )
                    .multipleChoiceResolver((field, item) => {
                        if (field.key === 'AssignedFoodsVirtual') {
                            return {
                                assignedItems: (yField, yItem) => {
                                    return yItem && yItem.childFoods
                                        ? Observable.of(yItem.childFoods.map((dish: FoodDish) => this.getMultipleChoiceFoodOption(dish)))
                                        : Observable.of([]);
                                },
                                onDialogClick: (xField, xItem) => this.openSelectFoodDialog(),
                                addItem: this.dishValueChange
                            };
                        }

                        return undefined;
                    })
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('foods/dishes')]))
                    .optionLabelResolver((field, originalLabel) => {
                        if (field.key === 'FoodCategoryId') {
                            return super.translate('module.foodCategories.categories.' + originalLabel);
                        } else if (field.key === 'FoodUnitId') {
                            return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
                        }

                        return Observable.of(originalLabel);
                    })
                    .onEditFormLoaded(form => {
                        this.item = form.item;

                        this.setConfig({
                            menuItems: new DishMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.editDish'
                            }
                        });
                    })
                    .build();
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }
}
