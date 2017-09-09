// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

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
                componentTitle: { key: 'module.clients.diet.newDiet' },
                menuItems: new NewClientDietMenuItems(client.id).menuItems,
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
            .switchMap(clientId => {
                return this.dependencies.itemServices.dietService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map(form => {
                // manually set client id
                form.withFieldValue('ClientId', this.clientId);
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                form.insertFunction((item) => this.dependencies.itemServices.dietService.create(item).set());
                form.onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/diet/' + response.item.id + '/diet-plan')]));

                this.formConfig = form.build();
            },
            error => super.handleError(error))
    }
}