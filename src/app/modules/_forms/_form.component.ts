// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { FormConfig } from '../../../web-components/dynamic-form';

@Component({
    templateUrl: '_form.component.html'
})
export class FormComponent extends BaseComponent implements OnInit {

    private formEditConfig: FormConfig<any>;
    private formInsertConfig: FormConfig<any>;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.startLoader();

        this.dependencies.itemServices.logService.insertForm()
            .subscribe(form => {
                form.onFormInit(() => this.stopLoader());
                form.onBeforeSave(() => this.startGlobalLoader());
                form.onAfterSave(() => this.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
                this.formInsertConfig = form.build();
            });

        this.dependencies.itemServices.logService.editForm(1)
            .subscribe(form => {
                form.onFormInit(() => this.stopLoader());
                form.onBeforeSave(() => this.startGlobalLoader());
                form.onAfterSave(() => this.stopGlobalLoader());
                form.onAfterDelete(() => this.navigate([this.getTrainerUrl('workouts')]));
                form.onError(() => super.stopGlobalLoader());

                var item = form.getItem();

                this.setConfig({
                    menuItems: null,
                    menuTitle: {
                        key: item.codename
                    },
                    componentTitle: {
                        'key': 'module.sample.test'
                    }
                });

                this.formInsertConfig = form.build();
            });
    }
}