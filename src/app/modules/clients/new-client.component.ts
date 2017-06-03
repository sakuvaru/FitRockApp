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
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/models/options';

// required by component
import { UserFormsService } from '../../forms/user-forms.service';
import { FormConfig } from '../../core/web-components/dynamic-form/form-config.class';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseComponent {

    private insertFields: BaseField<any>[];
    private error: string;
    private formConfig: FormConfig<any>;

    constructor(
        private userFormsService: UserFormsService,
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)

        this.formConfig = this.userFormsService.getInsertForm({
            saveFunction: (item) => this.dependencies.userService.createClient(item),
            insertCallback: (response) => {
                // redirect to view client page
                this.dependencies.router.navigate(['/client/clients/view/', response.item.id]);
            },
            errorCallback: (err) => {
                console.log("This is error callback: " + err);
            }
        });
    }

    initAppData(): AppData {
        return new AppData({
            subTitle: "Nový klient"
        });
    }
}