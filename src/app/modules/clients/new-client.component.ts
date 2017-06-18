// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { ClientOverviewMenuItems } from './menu.items';
import { BaseField, FormConfig } from '../../../lib/web-components';
import { User } from '../../models';
import { UserFormsService } from '../../forms';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseComponent {

    private formConfig: FormConfig<User>;

    constructor(
        private userFormsService: UserFormsService,
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)

        this.setConfig({
            componentTitle: { key: 'module.clients.newClient' },
            menuItems: new ClientOverviewMenuItems().menuItems
        });

        this.formConfig = this.userFormsService.insertForm()
            .insertFunction((item) => this.dependencies.userService.createClient(item).set())
            .callback((response) => {
                // redirect to view client page
                this.dependencies.router.navigate([this.getTrainerUrl('clients/edit'), response.item.id])
            })
            .build();
    }
}