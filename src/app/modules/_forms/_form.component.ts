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
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/models/options';

// required by component
import { LogFormsService } from '../../forms/log-forms.service';
import { FormConfig } from '../../core/web-components/dynamic-form/form-config.class';

@Component({
    templateUrl: '_form.component.html'
})
export class FormComponent extends BaseComponent {

    private formEditConfig: FormConfig<any>;
    private formInsertConfig: FormConfig<any>;

    constructor(
        private logFormsService: LogFormsService,
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        this.logFormsService.getInsertForm();
        this.logFormsService.getEditForm(1);
    }

    initAppData(): AppData {
        return new AppData({
            subTitle: "Subtitle sample"
        });
    }
}