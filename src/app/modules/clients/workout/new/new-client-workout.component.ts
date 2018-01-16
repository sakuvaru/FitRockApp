import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService, ComponentSetup } from '../../../../core';
import { ClientsBaseComponent } from '../../clients-base.component';
import { NewClientWorkoutMenuItems } from '../../menu.items';

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

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
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
                },
                menuAvatarUrl: client.getAvatarOrGravatarUrl()
            });
        });
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(params => {
                this.formConfig = this.dependencies.itemServices.workoutService.buildInsertForm()
                    .configField((field, item) => {
                        if (field.key === 'ClientId') {
                            field.value = this.clientId;
                        }
                        return Observable.of(field);
                    })
                    .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/workout/' + response.item.id + '/workout-plan')]))
                    .onInsertFormLoaded(form => {
                       
                    })
                    .optionLabelResolver((field, label) => {
                        if (field.key === 'WorkoutCategoryId') {
                            return super.translate(`module.workoutCategories.categories.${label}`);
                        }
        
                        return Observable.of(label);
                    })  
                    .build();

            },
            error => super.handleAppError(error));
    }
}
