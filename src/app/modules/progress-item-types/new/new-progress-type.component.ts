import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-new-progress-type',
    templateUrl: 'new-progress-type.component.html'
})
export class NewProgressTypeComponent extends BaseModuleComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.buildInsertForm()
            .configField((field, item) => {
                if (field.key === 'TranslateValue') {
                    field.value = false;
                }
                return Observable.of(field);
            })
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('progress-item-types/edit'), response.item.id]))
            .build();
    }
}
