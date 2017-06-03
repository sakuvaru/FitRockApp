// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
import { BaseField, FormConfig } from '../../../lib/web-components.lib';
import { User } from '../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'view-client.component.html'
})
export class ViewClientComponent extends BaseComponent implements OnInit {

    private client: User;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .switchMap((params: Params) => this.dependencies.userService.getById(+params['id']))
            .subscribe(response => this.client = response.item);
    }

     initAppData(): AppData {
        return new AppData({
            subTitle: "Klient"
        });
    }
}