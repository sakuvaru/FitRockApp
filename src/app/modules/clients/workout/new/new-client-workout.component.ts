// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { NewClientWorkoutMenuItems } from '../../menu.items';
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
        super(componentDependencyService, activatedRoute, { subscribeToClient: true })
    }
    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getObservables());
        super.initClientSubscriptions();
    }

    private getObservables(): Observable<any>[]{
        var observables: Observable<any>[] = [];
        observables.push(this.getClientObservable());
        observables.push(this.getFormObservable());
        return observables;
    }

    private getClientObservable(): Observable<any> {
        return this.clientChange.map(client => {
           this.setConfig({
                componentTitle: { key: 'module.clients.submenu.newClient' },
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
            .switchMap(params => {
                return this.dependencies.itemServices.workoutService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map(form => {
                // manually set client id
                form.withFieldValue('ClientId', this.clientId);
              
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.workoutService.create(item).set());
                form.onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/workout/' + response.item.id + '/workout-plan')]));

                this.formConfig = form.build();

                this.setConfig({
                    componentTitle: { key: 'module.clients.workout.newWorkout' },
                    menuItems: new NewClientWorkoutMenuItems(this.clientId).menuItems
                });
            },
            error => super.handleError(error))
    }
}