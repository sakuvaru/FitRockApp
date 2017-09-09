// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { NewClientProgressItemTypeMenuItems } from '../../menu.items';
import { ProgressItemType } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-progress-item-type.component.html'
})
export class NewClientProgressItemTypeComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItemType>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute)
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
                componentTitle: { key: 'module.clients.progress.newProgressItemType' },
                menuItems: new NewClientProgressItemTypeMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                }
            });
        });
    }

    private getFormObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(client => {
                return this.dependencies.itemServices.progressItemTypeService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map(form => {
                // set client id manually
                form.withFieldValue('ClientId', this.clientId);
                form.withFieldValue('TranslateValue', false);

                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.progressItemTypeService.create(item).set());
                form.onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/progress')]));

                this.formConfig = form.build();
            },
            error => super.handleError(error))
    }
}