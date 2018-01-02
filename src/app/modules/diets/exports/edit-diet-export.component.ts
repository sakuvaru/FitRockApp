import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Diet } from '../../../models';

@Component({
    templateUrl: 'edit-diet-export.component.html',
    selector: 'edit-diet-export'
})
export class EditDietExportComponent extends BaseComponent implements OnInit, OnChanges {

    @Output() loadDiet = new EventEmitter<Diet>();

    @Input() dietId: number;

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
            isNested: true
        });
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

                return Observable.of(originalLabel);
            })
            .build();
    }
}
