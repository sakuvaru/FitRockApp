import { TdDialogService } from '@covalent/core/dialogs/services/dialog.service';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig } from 'web-components/data-form';

@Component({
    templateUrl: 'calendar-edit-event-dialog.component.html',
})
export class CalendarEditEventDialogComponent extends BaseWebComponent {

    public formConfig?: DataFormConfig;

    /**
     * Indicates if data was changes. If it has, the calendar component should 
     * reload events to see changes
     */
    public dataChanged: boolean = false;

    constructor(
        private dialogService: TdDialogService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        super();
        this.formConfig = data.formConfig;

        if (this.formConfig) {
            this.formConfig.onAfterEdit = (response) => {
                this.dataChanged = true;
                this.close();   
            };
        }
    }

    close(): void {
        this.dialogService.closeAll();
    }
}
