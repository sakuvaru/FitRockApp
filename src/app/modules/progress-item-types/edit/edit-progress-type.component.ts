import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { ProgressItemType } from '../../../models';

@Component({
    selector: 'mod-edit-progress-type',
    templateUrl: 'edit-progress-type.component.html'
})
export class EditProgressTypeComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() progressTypeId: number;

    @Output() loadProgressType = new EventEmitter<ProgressItemType>();

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.progressTypeId) {
            this.initForm();
        }
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.buildEditForm(this.progressTypeId)
            .onAfterDelete(() => super.navigate([this.getTrainerUrl('progress-item-types')]))
            .onEditFormLoaded(form => {
                this.loadProgressType.next(form.item);
            })
            .build();
    }
}
