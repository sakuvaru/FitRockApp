// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { Workout } from '../../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'workout-client-edit.component.html'
})
export class WorkoutClientEditComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Workout>;
    private clientId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => {
                this.clientId = +params['id'];
                return this.dependencies.itemServices.workoutService.editForm(+params['workoutId']).takeUntil(this.ngUnsubscribe);
            })
            .subscribe(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
                form.onAfterDelete(() => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/workout')]));
                var workout = form.getItem();

                this.setConfig({
                    menuItems: new ClientEditWorkoutMenuItems(this.clientId).menuItems,
                    menuTitle: {
                        key: 'module.clients.editWorkout'
                    },
                    componentTitle: {
                        key: workout.workoutName
                    }
                });

                // get form
                this.formConfig = form.build();
            }
            ,
            error => super.handleError(error));
    }
}