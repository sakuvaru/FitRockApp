// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { Workout } from '../../../models';

@Component({
    templateUrl: 'new-workout.component.html'
})
export class NewWorkoutComponent extends BaseComponent {

    private formConfig: FormConfig<Workout>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)

        this.setConfig({
            componentTitle: { key: 'module.workout.newWorkout' },
            menuItems: new WorkoutsOverviewMenuItems().menuItems
        });

        this.dependencies.itemServices.workoutService.insertForm()
            .subscribe(form => {
                form.insertFunction((item) => this.dependencies.itemServices.workoutService.create(item).set())
                form.callback((response) => {
                    this.dependencies.router.navigate([this.getTrainerUrl('workouts/view'), response.item.id])
                })

                this.formConfig = form.build();
            });
    }
}