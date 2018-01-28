import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Diet } from '../../../models';
import { stringHelper } from 'lib/utilities';

@Component({
    templateUrl: 'edit-diet.component.html',
    selector: 'mod-edit-diet'
})
export class EditDietComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Output() loadDiet = new EventEmitter<Diet>();

    @Input() dietId: number;

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnChanges(changes: SimpleChanges) {
        const dietId = changes.dietId.currentValue;
        if (dietId) {
            this.initForm(dietId);
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private initForm(dietId: number): void {
        this.formConfig = this.dependencies.itemServices.dietService.buildEditForm(dietId)
            .onAfterDelete(() => super.navigate([super.getTrainerUrl('diets')]))
            .onEditFormLoaded(form => {
                const diet = form.item;

                // set loaded workout
                this.loadDiet.next(diet);
            })
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'DietCategoryId') {
                    return super.translate('module.dietCategories.categories.' + originalLabel);
                }
                if (field.key === 'Day') {
                    return super.translate('module.days.' + stringHelper.firstCharToLowerCase(originalLabel));
                }

                return Observable.of(originalLabel);
            })
            .build();
    }
}
