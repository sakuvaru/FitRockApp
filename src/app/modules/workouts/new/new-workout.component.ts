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
export class NewWorkoutComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Workout>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }
    
    ngOnInit() {
        super.ngOnInit();
        
        this.startLoader();

          this.setConfig({
            componentTitle: { key: 'module.workouts.newWorkout' },
            menuItems: new WorkoutsOverviewMenuItems().menuItems
        });

        this.dependencies.itemServices.workoutService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(form => {
                form.onFormInit(() => this.stopLoader())
                form.onBeforeSave(() => this.startGlobalLoader());
                form.onAfterSave(() => this.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.workoutService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('workouts/edit-plan'), response.item.id]));

                this.formConfig = form.build();
            });
    }
}