import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Covalent modules for Angular2
import {
    CovalentChipsModule, CovalentCommonModule, CovalentDataTableModule, CovalentDialogsModule, CovalentExpansionPanelModule,
    CovalentFileModule, CovalentJsonFormatterModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
    CovalentMenuModule, CovalentMessageModule, CovalentNotificationsModule, CovalentPagingModule, CovalentSearchModule,
    CovalentStepsModule, CovalentVirtualScrollModule
} from '@covalent/core';

@NgModule({
    imports: [
        CommonModule,
        CovalentChipsModule, CovalentCommonModule, CovalentDataTableModule, CovalentDialogsModule, CovalentExpansionPanelModule,
        CovalentFileModule, CovalentJsonFormatterModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
        CovalentMenuModule, CovalentMessageModule, CovalentNotificationsModule, CovalentPagingModule, CovalentSearchModule,
        CovalentStepsModule, CovalentVirtualScrollModule
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: [
        CommonModule,
        CovalentChipsModule, CovalentCommonModule, CovalentDataTableModule, CovalentDialogsModule, CovalentExpansionPanelModule,
        CovalentFileModule, CovalentJsonFormatterModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
        CovalentMenuModule, CovalentMessageModule, CovalentNotificationsModule, CovalentPagingModule, CovalentSearchModule,
        CovalentStepsModule, CovalentVirtualScrollModule
    ]
})
export class CovalentModule { }
