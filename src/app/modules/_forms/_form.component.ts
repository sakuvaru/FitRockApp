// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { FormConfig } from '../../../web-components/dynamic-form';

@Component({
    templateUrl: '_form.component.html'
})
export class FormComponent extends BaseComponent {

    private formEditConfig: FormConfig<any>;
    private formInsertConfig: FormConfig<any>;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        this.dependencies.itemServices.logService.insertForm()
            .subscribe(form => this.formInsertConfig = form.build()
            );

        this.dependencies.itemServices.logService.editForm(1)
            .subscribe(form => this.formEditConfig = form.build()
            );
    }
}