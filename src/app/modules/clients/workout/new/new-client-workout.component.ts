// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { ClientMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';

@Component({
    templateUrl: 'new-client-workout.component.html'
})
export class NewClientWorkoutComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Workout>;
    private clientId: number;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        private activatedRoute: ActivatedRoute) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();
        this.initForm();
    }

    private initForm(): void {
        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap(params => {
                this.clientId = +params['id'];
                return this.dependencies.itemServices.workoutService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .subscribe(form => {
                console.log(form);
                // manually set client id
                form.withFieldValue('ClientId', this.clientId);

                form.onFormInit(() => super.stopLoader())
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.workoutService.create(item).set());
                form.onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/workout/' + response.item.id + '/workout-plan')]));
                form.onError(() => super.stopGlobalLoader());

                this.formConfig = form.build();

                this.setConfig({
                    componentTitle: { key: 'module.clients.submenu.newWorkout' },
                    menuItems: new ClientMenuItems(this.clientId).menuItems
                });
            },
            error => super.handleError(error))
    }
}