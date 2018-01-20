import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Location } from '../../../models';

@Component({
    selector: 'mod-edit-location',
    templateUrl: 'edit-location.component.html'
})
export class EditLocationComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() locationId: number;

    @Output() loadLocation = new EventEmitter<Location>();

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.locationId) {
            this.initForm();
        }
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.locationService.buildEditForm(this.locationId)
            .onAfterDelete(() => super.navigate([this.getTrainerUrl('locations')]))
            .onEditFormLoaded(form => {
                this.loadLocation.next(form.item);
            })
            .optionLabelResolver((field, optionLabel) => {
                if (field.key === 'LocationType') {
                    return super.translate('module.locations.type.' + optionLabel);
                }
                return Observable.of(optionLabel);
            })
            .build();
    }
}
