import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { FoodMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Observable';
import { stringHelper } from 'lib/utilities';

@Component({
    templateUrl: 'edit-food.component.html'
})
export class EditFoodComponent extends BasePageComponent implements OnInit {

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
                this.formConfig = this.dependencies.itemServices.foodService.buildEditForm(+params['id'])
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('foods')]))
                    .optionLabelResolver((field, originalLabel) => {
                        if (field.key === 'FoodCategoryId') {
                            return super.translate('module.foodCategories.categories.' + originalLabel);
                        } else if (field.key === 'FoodUnitId') {
                            return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
                        }

                        return Observable.of(originalLabel);
                    })
                    .ignoreFields([
                        'AssignedFoodsVirtual'
                    ])
                    .onEditFormLoaded(form => {
                        this.setConfig({
                            menuItems: new FoodMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.editFood'
                            }
                        });
                    })
                    .build();
            })
            .subscribe();
    }
}
