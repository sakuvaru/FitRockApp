// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { ClientMenuItems } from '../../menu.items';
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

        super.subscribeToObservable(this.getFormObservable());
        super.initClientSubscriptions();
    }

    private getFormObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(client => {
                return this.dependencies.itemServices.progressItemTypeService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map(form => {
                form.onFormInit(() => super.stopLoader())
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.progressItemTypeService.create(item).set());
                form.onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.clientId + '/progress')]));
                form.onError(() => super.stopGlobalLoader());

                this.formConfig = form.build();

                this.setConfig({
                    menuItems: new ClientMenuItems(this.client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': this.client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.progress.newProgressItemType'
                    }
                });

                this.setConfig({
                    componentTitle: { key: 'module.clients.progress.newProgressItemType' },
                    menuItems: new ClientMenuItems(this.clientId).menuItems
                });
            },
            error => super.handleError(error))
    }
}