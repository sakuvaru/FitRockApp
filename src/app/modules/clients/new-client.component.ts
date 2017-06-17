// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
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

        this.dependencies.translateService.get('module.clients.newClient').subscribe(key => this.setSubtitle(key));

        this.formConfig = this.userFormsService.insertForm()
            .insertFunction((item) => this.dependencies.userService.createClient(item).set())
            .callback((response) => {
                // redirect to view client page
                this.dependencies.router.navigate([this.getTrainerUrl('clients/view'), response.item.id])
            })
            .build();
    }
}