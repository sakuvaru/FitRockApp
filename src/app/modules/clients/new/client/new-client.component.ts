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
        this.startLoader();

        this.setConfig({
            componentTitle: { key: 'module.clients.newClient' },
            menuItems: new ClientOverviewMenuItems().menuItems
        });

        this.dependencies.itemServices.userService.insertForm()
            .subscribe(form => {
                form.onFormLoaded(() => this.stopLoader());

                form.insertFunction((item) => this.dependencies.itemServices.userService.createClient(item).set())
                form.callback((response) => {
                    // redirect to view client page
                    this.dependencies.router.navigate([this.getTrainerUrl('clients/edit'), response.item.id])
                })

                this.formConfig = form.build();
            });
    }
}