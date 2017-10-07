// common
import { Inject, Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';

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

    private formConfig: FormConfig<ProgressItemType>;

    private customSaveButtonSubject: Subject<void> = new Subject<void>();
    private customDeleteButtonSubject: Subject<void> = new Subject<void>();
    private formStatus: DynamicFormStatus | undefined;

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
        }
    }

    ngOnInit() {
        super.ngOnInit();

        
        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.insertForm()
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ClientId') {
                    return this.clientId;
                }
                else if (fieldName === 'TranslateValue') {
                    return false
                }
                return value;
            })
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onAfterInsert((response) => {
                this.createdProgressItemType = response.item;
                this.close();
            })
            .build();
    }

    private onStatusChanged(status: DynamicFormStatus): void {
        this.formStatus = status;
      }

    private close(): void {
        this.dependencies.tdServices.dialogService.closeAll();
    }
}