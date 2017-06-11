// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
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
            .switchMap((params: Params) => this.dependencies.userService.getById(+params['id']))
            .subscribe(response => {
                this.client = response.item;

                // set title
                this.dependencies.translateService.get('module.clients.viewClientSubtitle', { 'fullName': this.client.getFullName() })
                    .subscribe(key => {
                       this.setSubtitle(key)
                    });

                // get form
                this.formConfig = this.userFormsService.getEditForm(
                    {
                        item: response.item
                    },
                    {
                        saveFunction: (item) => this.dependencies.userService.edit(item),
                        updateCallback: (response) => {
                        },
                    });
            });
    }
}