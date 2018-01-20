import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-new-diet-template',
    templateUrl: 'new-diet-template.component.html'
})
export class NewDietTemplateComponent extends BaseModuleComponent implements OnInit {

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
        this.formConfig = this.dependencies.itemServices.dietService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('diets/edit-plan'), response.item.id]))
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'DietCategoryId') {
                    return super.translate('module.dietCategories.categories.' + originalLabel);
                }

                return Observable.of(originalLabel);
            })
            .build();
    }
}
