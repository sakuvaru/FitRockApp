// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../../web-components/data-table';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProgressItem } from '../../../../models';
import { FormConfig, DynamicFormStatus } from '../../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-progress-item-dialog.component.html'
})
export class EditProgressItemDialogComponent extends BaseComponent implements OnInit {

  private formConfig: FormConfig<ProgressItem>;

  public item: ProgressItem;
  public idOfDeletedItem: number;
  public itemWasDeleted: boolean = false;
  public itemWasUpdated: boolean = false;

  private customSaveButtonSubject: Subject<void> = new Subject<void>();
  private customDeleteButtonSubject: Subject<void> = new Subject<void>();
  private formStatus: DynamicFormStatus | undefined;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    this.item = data;

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
    this.formConfig = this.dependencies.itemServices.progressItemService.editForm(this.item.id)
      .onAfterUpdate((response) => {
        this.itemWasUpdated = true;
        this.close();
      })
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onAfterDelete((response) => {
        this.idOfDeletedItem = response.deletedItemId;
        this.itemWasDeleted = true;
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
