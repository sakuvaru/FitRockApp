// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { ClientOverviewMenuItems } from '../../menu.items';
import { User } from '../../../../models';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<User>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.startLoader();

        this.setConfig({
            componentTitle: { key: 'module.clients.newClient' },
            menuItems: new ClientOverviewMenuItems().menuItems
        });

        this.dependencies.itemServices.userService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(form => {
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
            }
            ,
            error => super.handleError(error));
    }
}