// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { FormConfig } from '../../../web-components/dynamic-form';
import { Observable } from 'rxjs/Rx';

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

        super.subscribeToObservables(this.getFormObservables());
    }

    private getFormObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];

        observables.push(this.dependencies.itemServices.logService.insertForm()
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                this.formInsertConfig = form.build();
            },
            error => super.handleError(error)));

        observables.push(this.dependencies.itemServices.logService.editForm(1)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                form.onAfterDelete(() => this.navigate([this.getTrainerUrl('workouts')]));

                var item = form.getItem();

                this.setConfig({
                    menuTitle: {
                        key: item.codename
                    },
                    componentTitle: {
                        'key': 'module.sample.test'
                    }
                });

                this.formInsertConfig = form.build();
            },
            error => super.handleError(error)));

        return observables;
    }
}