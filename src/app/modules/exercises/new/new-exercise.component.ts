// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewExerciseMenuItems } from '../menu.items';
import { Exercise } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-exercise.component.html'
})
export class NewExerciseComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Exercise>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.exercises.new' },
            menuItems: new NewExerciseMenuItems().menuItems
        });

        super.subscribeToObservable(this.getFormObservable());
    }

    private getFormObservable(): Observable<any> {
        return this.dependencies.itemServices.exerciseService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.exerciseService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('exercises/edit'), response.item.id]));

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}