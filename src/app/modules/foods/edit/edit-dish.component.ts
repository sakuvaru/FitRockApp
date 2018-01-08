import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig } from 'app/config';
import { Food, FoodDish, NewChildFoodVirtualModel } from 'app/models';
import { stringHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { guidHelper } from '../../../../lib/utilities';
import { DataFormConfig, DataFormMultipleChoiceItem, DataFormMultipleChoiceFieldConfig, DataFormFieldChangeResult, DataFormField, DataFormChangeField } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { SelectFoodDialogComponent } from '../dialogs/select-food-dialog.component';
import { EditFoodDishDialogComponent } from '../dialogs/edit-food-dish-dialog.component';
import { FoodDishAmountDialogComponent } from '../dialogs/food-dish-amount.component';
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
        // calculate food with amount to get proper nutrition distribution
        const foodCalculation = this.dependencies.itemServices.foodService.calculateFoodWithAmount(food, amount);

        return [
            this.dependencies.coreServices.localizationHelperService.translateFoodAmountAndUnit(
                amount,
                food.foodUnit.unitCode
            ),
            this.dependencies.coreServices.localizationHelperService.translateFoodComposition(
                foodCalculation.prot,
                foodCalculation.fat,
                foodCalculation.cho,
                foodCalculation.kcal)
        ];
    }

    private createVirtualFoodOption(food: Food, amount: number): DataFormMultipleChoiceItem<NewChildFoodVirtualModel> {
        const virtualModel = new NewChildFoodVirtualModel(food.id, amount, food.foodUnit.unitCode, food);

        return new DataFormMultipleChoiceItem(
            guidHelper.newGuid(),
            virtualModel,
            Observable.of(food.foodName),
            this.getFoodOptionMetaLines(food, amount)
        );
    }

    private getMultipleChoiceFoodOption(dish: FoodDish): DataFormMultipleChoiceItem<NewChildFoodVirtualModel> {
        return new DataFormMultipleChoiceItem<NewChildFoodVirtualModel>(
            dish.id.toString(),
            new NewChildFoodVirtualModel(dish.food.id, dish.amount, dish.food.foodUnit.unitCode, dish.food, dish.id),
            Observable.of(dish.food.foodName),
            this.getFoodOptionMetaLines(dish.food, dish.amount)
        );
    }

    private openEditFoodDishDialog(selectedItems: DataFormMultipleChoiceItem<NewChildFoodVirtualModel>[]): void {
        const data: any = {
            items: selectedItems
        };

        const dialog = this.dependencies.tdServices.dialogService.open(EditFoodDishDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
        dialog.afterClosed()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(m => {
                if (dialog.componentInstance.items && dialog.componentInstance.items.length > 0) {
                    dialog.componentInstance.items.forEach(item => {
                        // refresh metalines
                        item.metaLines = this.getFoodOptionMetaLines(item.rawValue.food, item.rawValue.amount);
                        this.dishValueChange.next(item);
                    });
                }
            });
    }

    private openAmountDialog(selectedFood: Food): void {
        const data: any = {
            unitCode: selectedFood.foodUnit.unitCode
        };

        const dialog = this.dependencies.tdServices.dialogService.open(FoodDishAmountDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
        dialog.afterClosed()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(m => {
                // check if amount was set
                if (dialog.componentInstance.amount) {
                    this.dishValueChange.next(
                        this.createVirtualFoodOption(selectedFood, dialog.componentInstance.amount)
                    );
                }
            });
    }

    private openSelectFoodDialog(): void {
        const data: any = {};

        const dialog = this.dependencies.tdServices.dialogService.open(SelectFoodDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
        dialog.afterClosed()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(m => {
                if (dialog.componentInstance.selectedFood) {
                    // open amount dialog
                    this.openAmountDialog(dialog.componentInstance.selectedFood);
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
                            return new DataFormMultipleChoiceFieldConfig<NewChildFoodVirtualModel>({
                                assignedItems: (yField, yItem) => {
                                    return yItem && yItem.childFoods
                                        ? Observable.of(yItem.childFoods.map((dish: FoodDish) => this.getMultipleChoiceFoodOption(dish)))
                                        : Observable.of([]);
                                },
                                onEditSelected: (selectedItems) => this.openEditFoodDishDialog(selectedItems),
                                onDialogClick: (xField, xItem) => this.openSelectFoodDialog(),
                                itemChange: this.dishValueChange,
                                addButtonText: super.translate('module.foods.addFood'),
                                removeButtonText: super.translate('module.foods.removeSelected'),
                                editButtonText: super.translate('shared.edit')
                            });
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
                    .fieldValueResolver((fieldName, value, item) => {
                        // make sure assigned foods are assigned for calculation by 'onFieldValueChange'
                        if (item) {
                            const models = item.childFoods.map((dish: FoodDish) =>
                                this.getMultipleChoiceFoodOption(dish))
                                .map(s => s.rawValue);

                            if (item && fieldName === 'AssignedFoodsVirtual') {
                                return Observable.of(models);
                            }

                            if (models) {
                                const calculations = this.dependencies.itemServices.foodService.aggregateFoodsNutrition(
                                    models.map(s => {
                                        return {
                                            food: s.food,
                                            amount: s.amount
                                        };
                                    })
                                );

                                if (fieldName === 'Kcal') {
                                    return Observable.of(calculations.kcal);
                                }
                                if (fieldName === 'Cho') {
                                    return Observable.of(calculations.cho);
                                }
                                if (fieldName === 'Fat') {
                                    return Observable.of(calculations.fat);
                                }
                                if (fieldName === 'Sugar') {
                                    return Observable.of(calculations.sugar);
                                }
                                if (fieldName === 'Prot') {
                                    return Observable.of(calculations.prot);
                                }
                                if (fieldName === 'Nacl') {
                                    return Observable.of(calculations.nacl);
                                }
                            }
                        }

                        return Observable.of(value);
                    })
                    .onFieldValueChange((fields, changedField, newValue) => {
                        const newFields: DataFormChangeField[] = [];

                        if (changedField.key === 'AssignedFoodsVirtual') {

                            // recalculate dish components
                            const assignedFoods = newValue as NewChildFoodVirtualModel[];
                            const kcalField = fields.find(m => m.key === 'Kcal');
                            const choField = fields.find(m => m.key === 'Cho');
                            const fatField = fields.find(m => m.key === 'Fat');
                            const sugarField = fields.find(m => m.key === 'Sugar');
                            const protField = fields.find(m => m.key === 'Prot');
                            const naclField = fields.find(m => m.key === 'Nacl');

                            if (assignedFoods) {
                                const calculation = this.dependencies.itemServices.foodService.aggregateFoodsNutrition(
                                    assignedFoods.map(s => {
                                        return {
                                            food: s.food,
                                            amount: s.amount
                                        };
                                    })
                                );

                                if (kcalField) {
                                    newFields.push(new DataFormChangeField(kcalField.key, calculation.kcal));
                                }

                                if (choField) {
                                    newFields.push(new DataFormChangeField(choField.key, calculation.cho));
                                }

                                if (fatField) {
                                    newFields.push(new DataFormChangeField(fatField.key, calculation.fat));
                                }

                                if (sugarField) {
                                    newFields.push(new DataFormChangeField(sugarField.key, calculation.sugar));
                                }

                                if (protField) {
                                    newFields.push(new DataFormChangeField(protField.key, calculation.prot));
                                }

                                if (naclField) {
                                    newFields.push(new DataFormChangeField(naclField.key, calculation.nacl));
                                }
                            }
                        }

                        return Observable.of(new DataFormFieldChangeResult(newFields));
                    })
                    .build();
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }
}
