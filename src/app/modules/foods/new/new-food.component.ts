import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig, DataFormComponent, DataFormInsertResponse } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Food } from 'app/models';

@Component({
    selector: 'mod-new-food',
    templateUrl: 'new-food.component.html'
})
export class NewFoodComponent extends BaseModuleComponent implements OnInit {

    public formConfig: DataFormConfig;

    @Input() redirectAfterInsert: boolean = true;

    @Input() renderButtons: boolean = true;

    @Output() onAfterInsert = new EventEmitter<DataFormInsertResponse<Food>>();

    @ViewChild(DataFormComponent) dataForm: DataFormComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.foodService.buildInsertForm(
            {
                formDefinitionQuery: this.dependencies.itemServices.foodService.insertFormQuery()
                    .withData('isMeal', false)
                    .withData('isFood', true)
            }
        )
            .ignoreFields(['AssignedFoodsVirtual'])
            .onAfterInsert((response) => {
                this.onAfterInsert.next(response);
                if (this.redirectAfterInsert) {
                    this.dependencies.coreServices.navigateService.foodPreviewPage(response.item.id).navigate();
                }
            })
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'FoodCategoryId') {
                    return super.translate('module.foodCategories.categories.' + originalLabel);
                } else if (field.key === 'FoodUnitId') {
                    return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
                }

                return Observable.of(originalLabel);
            })
            .renderButtons(this.renderButtons)
            .configField((field, item) => {
                if (field.key === 'Language') {
                    const language = this.currentLanguage;
                    if (!language) {
                        throw Error(`Language has to be set in order to create new foods`);
                    }
                    field.value = language.language.toString();
                } else if (field.key === 'IsMeal') {
                    field.value = false;
                } else if (field.key === 'IsFood') {
                    field.value = true;
                } else if (field.key === 'IsSupplement') {
                    field.value = false;
                }

                return Observable.of(field);
            })
            .build();
    }
}
