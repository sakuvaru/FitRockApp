// common
import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppConfig } from '../../core/config/app.config';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { BaseField } from '../../core/web-components/dynamic-form/base-field.class';
import { DataTableField } from '../../core/web-components/data-table/data-table-field.class';
import { DataTableConfig } from '../../core/web-components/data-table/data-table.config';
import { AlignEnum } from '../../core/web-components/data-table/align-enum';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/options.class';

// required by component
import { LogFormsService } from '../../forms/log-forms.service';

@Component({
    templateUrl: '_form.component.html'
})
export class FormComponent extends BaseComponent {

    private insertFields: BaseField<any>[];
    private editFields: BaseField<any>[];

    constructor(
        private logFormsService: LogFormsService,
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        logFormsService.getInsertFields().subscribe(fields => this.insertFields = fields);
        logFormsService.getEditFields(2).subscribe(fields => this.editFields = fields);
    }

    initAppData(): AppData {
        return new AppData("Form");
    }

    private handleInsertSubmit(form: FormGroup): void {
        this.logFormsService.saveInsertForm(form, (item) => this.dependencies.logService.create(item)).subscribe(item => {
            console.log(item);
            this.showSavedSnackbar();
        });
    }

    private handleEditSubmit(form: FormGroup): void {
        this.logFormsService.saveEditForm(form, (item) => this.dependencies.logService.edit(item)).subscribe(item => {
            console.log(item);
            this.showSavedSnackbar();
        });
    }
}