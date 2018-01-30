import { TdDialogService } from '@covalent/core';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig } from 'web-components/data-form';

@Component({
    templateUrl: 'calendar-insert-event-dialog.component.html',
})
export class CalendarInsertEventDialogComponent extends BaseWebComponent {

    public formConfig?: DataFormConfig;

    constructor(
        private dialogService: TdDialogService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        super();
        this.formConfig = data.formConfig;

        if (this.formConfig) {
            this.formConfig.onAfterInsert = (response) => this.close();
        }
    }

    close(): void {
        this.dialogService.closeAll();
    }
}
