import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-new-location',
    templateUrl: 'new-location.component.html'
})
export class NewLocationComponent extends BaseModuleComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.locationService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('locations/edit'), response.item.id]))
            .optionLabelResolver((field, optionLabel) => {
                if (field.key === 'LocationType') {
                    return super.translate('module.locations.type.' + optionLabel);
                }
                return Observable.of(optionLabel);
            })
            .build();
    }
}
