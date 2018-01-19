import { Component, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
    selector: 'mod-new-client-diet',
    templateUrl: 'new-client-diet.component.html'
})
export class NewClientDietComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(): void {
        if (this.client) {
            this.initForm();
        }
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.dietService.buildInsertForm()
            .configField((field, item) => {
                // manually set client
                if (field.key === 'ClientId') {
                    field.value = this.client.id;
                }
                return Observable.of(field);
            })
            .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.client.id + '/diet/' + response.item.id + '/diet-plan')]))
            .build();
    }
}
