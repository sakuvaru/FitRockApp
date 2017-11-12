// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { NewClientDietMenuItems } from '../../menu.items';
import { Diet } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-diet.component.html'
})
export class NewClientDietComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<Diet>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute, { subscribeToClient: true });
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
                componentTitle: { key: 'module.clients.diet.newDiet' },
                menuItems: new NewClientDietMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                },
                menuAvatarUrl: client.avatarUrl
            });
        });
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.formConfig = this.dependencies.itemServices.dietService.insertForm()
                    .fieldValueResolver((fieldName, value) => {
                        // manually set client
                        if (fieldName === 'ClientId') {
                            return this.clientId;
                        }
                        return value;
                    })
                    .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/diet/' + response.item.id + '/diet-plan')]))
                    .build();
            },
            error => super.handleError(error));
    }
}
