import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TdDialogService } from '@covalent/core';

import { BaseWebComponent } from '../../base-web-component.class';
import { DataTableConfig } from '../../data-table';

@Component({
    templateUrl: 'calendar-select-attendee-dialog.component.html',
})
export class CalendarSelectAttendeeDialogComponent extends BaseWebComponent {

    public dataTableConfig?: DataTableConfig;

    /*
    Selected attendee
    */
    public selectedAttendee: any | undefined;

    constructor(
        private dialogService: TdDialogService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        super();
        this.dataTableConfig = data.dataTableConfig;

        if (this.dataTableConfig) {
            this.dataTableConfig.onClick = (item => {
                this.selectedAttendee = item;
                this.close();
            });
        }
    }

    close(): void {
        this.dialogService.closeAll();
    }
}
