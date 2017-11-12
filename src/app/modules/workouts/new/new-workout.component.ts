// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

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
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.workouts.submenu.new' },
            menuItems: new NewWorkoutMenuItems().menuItems
        });

        this.initFom();
    }

    private initFom() {
        this.formConfig = this.dependencies.itemServices.workoutService.insertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('workouts/edit-plan'), response.item.id]))
            .build();
    }
}
