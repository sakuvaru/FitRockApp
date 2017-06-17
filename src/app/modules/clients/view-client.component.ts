// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { ClientMenuItems } from './client-menu.items';
import { BaseField, FormConfig } from '../../../lib/web-components';
import { User } from '../../models';
import 'rxjs/add/operator/switchMap';
import { UserFormsService } from '../../forms';

@Component({
    templateUrl: 'view-client.component.html'
})
export class ViewClientComponent extends BaseComponent implements OnInit {

    private client: User;
    private formConfig: FormConfig<User>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
        private userFormsService: UserFormsService
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .switchMap((params: Params) => this.dependencies.userService.item().byId(+params['id']).get())
            .subscribe(response => {
                this.client = response.item;

                // update title
                this.setConfig({
                    menuItems: new ClientMenuItems(response.item.id).menuItems,
                    componentTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': this.client.getFullName() }
                    }
                });

                // get form
                this.formConfig = this.userFormsService.editFormByItem(response.item)
                    .editFunction((item) => this.dependencies.userService.edit(item).set())
                    .build();
            });
    }
}