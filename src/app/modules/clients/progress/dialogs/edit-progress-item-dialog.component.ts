// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../../web-components/data-list';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProgressItem } from '../../../../models';
import { FormConfig, DynamicFormStatus } from '../../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-progress-item-dialog.component.html'
})
export class EditProgressItemDialogComponent extends BaseComponent implements OnInit {

  public formConfig: FormConfig<ProgressItem>;

  public item: ProgressItem;
  public idOfDeletedItem: number;
  public itemWasDeleted: boolean = false;
  public itemWasUpdated: boolean = false;

  public customSaveButtonSubject: Subject<void> = new Subject<void>();
  public customDeleteButtonSubject: Subject<void> = new Subject<void>();
  public formStatus: DynamicFormStatus | undefined;

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
      .wrapInCard(false)
      .onAfterUpdate((response) => {
        this.itemWasUpdated = true;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedItem = response.deletedItemId;
        this.itemWasDeleted = true;
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
