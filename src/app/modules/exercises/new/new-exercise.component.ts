// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataFormConfig } from '../../../../web-components/data-form';
import { NewExerciseMenuItems } from '../menu.items';
import { Exercise } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-exercise.component.html'
})
export class NewExerciseComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
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
        this.formConfig = this.dependencies.itemServices.exerciseService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('exercises/edit'), response.item.id]))
            .build();
    }
}
