// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewWorkoutMenuItems } from '../menu.items';
import { Workout } from '../../../models';
import { Observable } from 'rxjs/Rx';

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

        this.setConfig({
            componentTitle: { key: 'module.workouts.submenu.new' },
            menuItems: new NewWorkoutMenuItems().menuItems
        });

        super.subscribeToObservable(this.getFormObservable());
    }

    private getFormObservable(): Observable<any>{
        return this.dependencies.itemServices.workoutService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.workoutService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('workouts/edit-plan'), response.item.id]));

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}