// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { DataFormConfig } from '../../../../../web-components/data-form';
import { NewClientWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-workout.component.html'
})
export class NewClientWorkoutComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getObservables());
        super.initClientSubscriptions();
    }

    private getObservables(): Observable<any>[] {
        const observables: Observable<any>[] = [];
        observables.push(this.getClientObservable());
        observables.push(this.getFormObservable());
        return observables;
    }

    private getClientObservable(): Observable<any> {
        return this.clientChange.map(client => {
            this.setConfig({
                componentTitle: { key: 'module.clients.workout.newWorkout' },
                menuItems: new NewClientWorkoutMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                }
            });
        });
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(params => {
                this.formConfig = this.dependencies.itemServices.workoutService.buildInsertForm()
                    .fieldValueResolver((fieldName, value) => {
                        if (fieldName === 'ClientId') {
                            return Observable.of(this.clientId);
                        }
                        return Observable.of(value);
                    })
                    .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/workout/' + response.item.id + '/workout-plan')]))
                    .onInsertFormLoaded(form => {
                       
                    })
                    .build();

            },
            error => super.handleError(error));
    }
}
