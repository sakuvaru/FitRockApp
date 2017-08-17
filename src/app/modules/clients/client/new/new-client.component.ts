// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { NewClientMenuItems } from '../../menu.items';
import { User } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends ClientsBaseComponent implements OnInit  {

    private formConfig: FormConfig<User>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit(): void {
        super.ngOnInit();

         this.setConfig({
            componentTitle: { key: 'module.clients.submenu.newClient' },
            menuItems: new NewClientMenuItems().menuItems
        });

        super.subscribeToObservable(this.getFormObservable());
        super.initClientSubscriptions();
    }

    private getFormObservable(): Observable<any>{
        return this.dependencies.itemServices.userService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());

                form.insertFunction((item) => this.dependencies.itemServices.userService.createClient(item).set().takeUntil(this.ngUnsubscribe))
                form.onAfterInsert((response) => {
                    // redirect to view client page
                    super.navigate([super.getTrainerUrl('clients/edit'), response.item.id])
                })

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}