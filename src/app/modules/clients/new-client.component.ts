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
import { UserFormsService } from '../../forms/user-forms.service';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseComponent {

    private insertFields: BaseField<any>[];
    private error: string;

    constructor(
        private userFormsService: UserFormsService,
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)

        this.userFormsService.getInsertFields().subscribe(fields => {
            this.insertFields = fields;
        });
    }

    initAppData(): AppData {
        return new AppData("Nový klient");
    }

    private handleInsert(form: FormGroup): void {
        this.userFormsService.saveInsertForm(form, (item) => this.dependencies.userService.createClient(item))
            .catch(err => {
                this.error = err;
                throw err
            })
            .subscribe(item => {
                this.showSavedSnackbar();
            });
    }
}