// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { ClientMenuItems } from './menu.items';
import { FormConfig } from '../../../lib/web-components';
import { User } from '../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-client.component.html'
})
export class EditClientComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<User>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .switchMap((params: Params) => this.dependencies.userService.editForm(+params['id']))
            .subscribe(form => {

                var user = form.getItem();

                this.setConfig({
                    menuItems: new ClientMenuItems(user.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': user.getFullName() }
                    },
                    componentTitle: {
                        'key': 'menu.clients.editClient'
                    }
                });

                // get form
                this.formConfig = form.build();
            });
    }
}