import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService } from '../../../../core';
import { ProgressItemType } from '../../../../models';

@Component({
    templateUrl: 'new-client-progress-item-type-dialog.component.html'
})
export class NewClientProgressItemTypeDialogComponent extends BaseDialogComponent<NewClientProgressItemTypeDialogComponent> implements OnInit {

    public formConfig: DataFormConfig;
    private clientId?: number;

    public createdProgressItemType?: ProgressItemType;

    constructor(
        protected dependencies: ComponentDependencyService,
        protected dialogRef: MatDialogRef<NewClientProgressItemTypeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(dependencies, dialogRef, data);
        this.clientId = data.clientId;
    }

    ngOnInit() {
        super.ngOnInit();


        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.buildInsertForm()
            .wrapInCard(false)
            .configField((field, item) => {
                if (field.key === 'ClientId') {
                    field.value = this.clientId;
                } else if (field.key === 'TranslateValue') {
                    field.value = false;
                }
                return Observable.of(field);
            })
            .onAfterInsert((response) => {
                this.createdProgressItemType = response.item;
                this.close();
            })
            .renderButtons(false)
            .build();
    }

    public close(): void {
        this.dependencies.tdServices.dialogService.closeAll();
    }
}
