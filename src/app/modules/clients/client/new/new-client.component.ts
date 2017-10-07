// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { NewClientMenuItems } from '../../menu.items';
import { User } from '../../../../models';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<User>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute)
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        }
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
        this.formConfig = this.dependencies.itemServices.userService.insertForm()
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onAfterInsert((response) => {
                // redirect to view client page
                super.navigate([super.getTrainerUrl('clients/edit'), response.item.id])
            })
            .build();
    }
}