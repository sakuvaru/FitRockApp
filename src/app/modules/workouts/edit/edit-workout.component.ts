// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Workout } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-workout.component.html'
})
export class EditWorkoutComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Workout>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .switchMap((params: Params) => this.dependencies.itemServices.workoutService.editForm(+params['id']))
            .subscribe(form => {
                var workout = form.getItem();

                this.setConfig({
                    menuItems: new WorkoutMenuItems(workout.id).menuItems,
                    menuTitle: {
                        key: workout.workoutName
                    },
                    componentTitle: {
                        'key': 'module.workouts.editWorkout'
                    }
                });

                // get form
                this.formConfig = form.build();
            });
    }
}