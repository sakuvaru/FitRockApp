// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { DataFormConfig } from '../../../../../web-components/data-form';
import { NewClientMenuItems } from '../../menu.items';
import { User } from '../../../../models';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.clients.submenu.newClient' },
            menuItems: new NewClientMenuItems().menuItems
        });

        this.initForm();
        super.initClientSubscriptions();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.userService.buildInsertForm({
            insertQuery: (item: User) => this.dependencies.itemServices.userService.createClient(item)
        })
            .onAfterInsert((response) => {
                // redirect to view client page
                super.navigate([super.getTrainerUrl('clients/edit'), response.item.id]);
            })
            .build();
    }
}
