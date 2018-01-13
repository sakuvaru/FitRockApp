import { Component, OnInit } from '@angular/core';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { NewMealMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-meal.component.html'
})
export class NewMealComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.foods.submenu.newMeal' },
            menuItems: new NewMealMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.foodService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('foods/meals/edit'), response.item.id]))
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'FoodCategoryId') {
                    return super.translate('module.foodCategories.categories.' + originalLabel);
                } else if (field.key === 'FoodUnitId') {
                    return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
                }

                return Observable.of(originalLabel);
            })
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'Language') {
                    const language = this.currentLanguage;
                    if (!language) {
                        throw Error(`Language has to be set in order to create new foods`);
                    }
                    return Observable.of(language.language.toString());
                } else if (fieldName === 'IsMeal') {
                    return Observable.of(true);
                }

                return Observable.of(value);
            })
            .build();
    }
}
