// common
import { Inject, Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { MAT_DIALOG_DATA } from '@angular/material';
import { ClientsBaseComponent } from '../../clients-base.component';
import { DataFormConfig } from '../../../../../web-components/data-form';
import { NewClientProgressItemTypeMenuItems } from '../../menu.items';
import { ProgressItemType } from '../../../../models';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-progress-item-type-dialog.component.html'
})
export class NewClientProgressItemTypeDialogComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    public createdProgressItemType?: ProgressItemType;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit() {
        super.ngOnInit();

        
        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.buildInsertForm()
            .wrapInCard(false)
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ClientId') {
                    return Observable.of(this.clientId);
                } else if (fieldName === 'TranslateValue') {
                    return Observable.of(false);
                }
                return Observable.of(value);
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
