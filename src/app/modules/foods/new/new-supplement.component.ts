import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig, DataFormInsertResponse, DataFormComponent } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Food } from 'app/models';

@Component({
    selector: 'mod-new-supplement',
    templateUrl: 'new-supplement.component.html'
})
export class NewSupplementComponent extends BaseModuleComponent implements OnInit {

    @Input() redirectAfterInsert: boolean = true;

    @Input() renderButtons: boolean = true;

    @Output() onAfterInsert = new EventEmitter<DataFormInsertResponse<Food>>();

    @ViewChild(DataFormComponent) dataForm: DataFormComponent;

    public formConfig: DataFormConfig;

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
                    .withData('isFood', false)
                    .withData('isSupplement', true)
            })
            .ignoreFields(['AssignedFoodsVirtual'])
            .onAfterInsert((response) => {
                this.onAfterInsert.next(response);
                if (this.redirectAfterInsert) {
                    this.dependencies.coreServices.navigateService.supplementPreviewPage(response.item.id).navigate();
                }
            })
            .renderButtons(this.renderButtons)
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'FoodCategoryId') {
                    return super.translate('module.foodCategories.categories.' + originalLabel);
                } else if (field.key === 'FoodUnitId') {
                    return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
                }

                return Observable.of(originalLabel);
            })
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
                    field.value = false;
                } else if (field.key === 'IsSupplement') {
                    field.value = true;
                }

                return Observable.of(field);
            })
            .build();
    }
}
