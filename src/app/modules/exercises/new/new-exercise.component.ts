// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewExerciseMenuItems } from '../menu.items';
import { Exercise } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-exercise.component.html'
})
export class NewExerciseComponent extends BaseComponent implements OnInit {

    public formConfig: FormConfig<Exercise>;

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
            componentTitle: { key: 'module.exercises.new' },
            menuItems: new NewExerciseMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.exerciseService.insertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('exercises/edit'), response.item.id]))
            .build();
    }
}
