// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ExerciseMenuItems } from '../menu.items';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Exercise } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-exercise.component.html'
})
export class EditExerciseComponent extends BasePageComponent implements OnInit {

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
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.exerciseService.buildEditForm(+params['id'])
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('exercises')]))
                    .onEditFormLoaded(form => {
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
