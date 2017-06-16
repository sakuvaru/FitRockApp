// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
import { FormConfig} from '../../../lib/web-components';
import { LogFormsService } from '../../forms';

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

        this.formInsertConfig = this.logFormsService.getInsertForm();
        this.formEditConfig = this.logFormsService.getEditForm({
            itemId: 1
        });
    }
}