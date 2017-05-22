// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/web-components/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { DataTableField } from '../../core/web-components/data-table/data-table-field.class';
import { DataTableConfig } from '../../core/web-components/data-table/data-table.config';
import { AlignEnum } from '../../core/web-components/data-table/align-enum';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/options.class';

// required by component
import { User } from '../../models/user.class';
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
        return new AppData("Klient");
    }
}