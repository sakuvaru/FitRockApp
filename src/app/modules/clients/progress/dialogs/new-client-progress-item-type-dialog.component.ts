// common
import { Inject, Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { MAT_DIALOG_DATA } from '@angular/material';
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig, DynamicFormStatus } from '../../../../../web-components/dynamic-form';
import { NewClientProgressItemTypeMenuItems } from '../../menu.items';
import { ProgressItemType } from '../../../../models';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-progress-item-type-dialog.component.html'
})
export class NewClientProgressItemTypeDialogComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: FormConfig<ProgressItemType>;

    public customSaveButtonSubject: Subject<void> = new Subject<void>();
    public customDeleteButtonSubject: Subject<void> = new Subject<void>();
    public formStatus: DynamicFormStatus | undefined;

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
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.insertForm()
            .wrapInCard(false)
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ClientId') {
                    return this.clientId;
                } else if (fieldName === 'TranslateValue') {
                    return false;
                }
                return value;
            })
            .onAfterInsert((response) => {
                this.createdProgressItemType = response.item;
                this.close();
            })
            .build();
    }

    public onStatusChanged(status: DynamicFormStatus): void {
        this.formStatus = status;
      }

    public close(): void {
        this.dependencies.tdServices.dialogService.closeAll();
    }
}
