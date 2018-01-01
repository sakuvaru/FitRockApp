import { Component, OnInit } from '@angular/core';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { NewDishMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-dish.component.html'
})
export class NewDishComponent extends BaseComponent implements OnInit {

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
            componentTitle: { key: 'module.foods.submenu.newDish' },
            menuItems: new NewDishMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.foodService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('foods/dishes/edit'), response.item.id]))
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
                } else if (fieldName === 'IsDishFood') {
                    return Observable.of(true);
                }

                return Observable.of(value);
            })
            .build();
    }
}
