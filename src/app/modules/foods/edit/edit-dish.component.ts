import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { DishMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Observable';
import { stringHelper } from 'lib/utilities';

@Component({
    templateUrl: 'edit-dish.component.html'
})
export class EditDishComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

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

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.foodService.buildEditForm(
                        this.dependencies.itemServices.foodService.editFormQuery(+params['id'])
                            .include('FoodDishes')
                    )
                    .fieldValueResolver((fieldName, value, item) => {
                        if (fieldName === 'FoodDishes' && item) {
                            console.log(item);
                        }

                        return Observable.of(value);
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
            .subscribe();
    }
}
