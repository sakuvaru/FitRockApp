// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ExerciseMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Exercise } from '../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-exercise.component.html'
})
export class EditExerciseComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Exercise>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.exerciseService.editForm(+params['id'])
                    .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('exercises')]))
                    .onFormLoaded(form => {
                        this.setConfig({
                            menuItems: new ExerciseMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.exerciseName
                            },
                            componentTitle: {
                                'key': 'module.exercises.edit'
                            }
                        });
                    })
                    .build();
            })
            .subscribe();
    }
}