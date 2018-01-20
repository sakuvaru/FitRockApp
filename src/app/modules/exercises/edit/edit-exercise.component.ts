import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Exercise } from '../../../models';

@Component({
    selector: 'mod-edit-exercise',
    templateUrl: 'edit-exercise.component.html'
})
export class EditExerciseComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() exerciseId: number;

    @Output() loadExercise = new EventEmitter<Exercise>();

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.exerciseId) {
            this.initForm();
        }
    }

    private initForm(): void {

        this.formConfig = this.dependencies.itemServices.exerciseService.buildEditForm(this.exerciseId)
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'ExerciseCategoryId') {
                    return super.translate('module.exerciseCategories.categories.' + originalLabel);
                }
                return Observable.of(originalLabel);
            })
            .onAfterDelete(() => super.navigate([this.getTrainerUrl('exercises')]))
            .onEditFormLoaded(form => {
                this.loadExercise.next(form.item);
            })
            .build();
    }
}
