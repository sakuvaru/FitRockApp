import { Component, OnInit } from '@angular/core';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'mod-new-exercise',
    templateUrl: 'new-exercise.component.html'
})
export class NewExerciseComponent extends BaseModuleComponent implements OnInit {

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
        this.formConfig = this.dependencies.itemServices.exerciseService.buildInsertForm()
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'ExerciseCategoryId') {
                    return super.translate('module.exerciseCategories.categories.' + originalLabel);
                }
                return Observable.of(originalLabel);
            })
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('exercises/edit'), response.item.id]))
            .build();
    }
}
