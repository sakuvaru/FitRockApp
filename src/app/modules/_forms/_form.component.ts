// common
import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppConfig } from '../../core/config/app.config';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { BaseField } from '../../core/dynamic-form/base-field.class';

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

        this.insertFields = logFormsService.getInsertFields();
        this.editFields = logFormsService.getEditFields(2);
    }

    initAppData(): AppData {
        return new AppData("Form");
    }

    private handleInsertSubmit(form: FormGroup): void {
        this.logFormsService.saveInsertForm(form).subscribe(item => {
            console.log(item);
            this.showSavedSnackbar();
        });
    }

    private handleEditSubmit(form: FormGroup): void {
        this.logFormsService.saveEditForm(form).subscribe(item => {
            console.log(item);
            this.showSavedSnackbar();
        });
    }
}