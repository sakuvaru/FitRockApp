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

        super.subscribeToObservable(this.getFormObservable());
    }

    private getFormObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => {
                return this.dependencies.itemServices.exerciseService.editForm(+params['id'])
                    .takeUntil(this.ngUnsubscribe);
            })
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                form.onAfterDelete(() => super.navigate([this.getTrainerUrl('exercises')]));
                var item = form.getItem();

                this.setConfig({
                    menuItems: new ExerciseMenuItems(item.id).menuItems,
                    menuTitle: {
                        key: item.exerciseName
                    },
                    componentTitle: {
                        'key': 'module.exercises.edit'
                    }
                });

                // get form
                this.formConfig = form.build();
            }
            ,
            error => super.handleError(error));
    }
}