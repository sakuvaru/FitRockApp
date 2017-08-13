// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { ClientMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-workout.component.html'
})
export class NewClientWorkoutComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<Workout>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute, { subscribeToClient: false })
    }
    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservable(this.getFormObservable());
        super.initClientSubscriptions();
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(params => {
                return this.dependencies.itemServices.workoutService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map(form => {
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
                    componentTitle: { key: 'module.clients.workout.newWorkout' },
                    menuItems: new ClientMenuItems(this.clientId).menuItems
                });
            },
            error => super.handleError(error))
    }
}