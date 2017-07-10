// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { ExercisesOverviewMenuItem } from '../menu.items';
import { Exercise } from '../../../models';

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

        this.startLoader();

        this.setConfig({
            componentTitle: { key: 'module.exercises.new' },
            menuItems: new ExercisesOverviewMenuItem().menuItems
        });

        this.dependencies.itemServices.exerciseService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(form => {
                form.onFormInit(() => this.stopLoader())
                form.onBeforeSave(() => this.startGlobalLoader());
                form.onAfterSave(() => this.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.exerciseService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('exercises/edit'), response.item.id]));
                form.onError(() => {
                    super.stopGlobalLoader();
                });

                this.formConfig = form.build();
            });
    }
}