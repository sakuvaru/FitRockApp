// common
import { Observable } from 'rxjs/Rx';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataFormConfig } from '../../../../web-components/data-form';
import { NewFoodMenuItems } from '../menu.items';
import { Food } from '../../../models';
import { stringHelper } from 'lib/utilities';

@Component({
    templateUrl: 'new-food.component.html'
})
export class NewFoodComponent extends BaseComponent implements OnInit {

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
            componentTitle: { key: 'module.foods.submenu.new' },
            menuItems: new NewFoodMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.foodService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('foods/edit'), response.item.id]))
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
                }

                return Observable.of(value);
            })
            .build();
    }
}
