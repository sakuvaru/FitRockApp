import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService, ComponentSetup } from '../../../../core';
import { ProgressItem } from '../../../../models';

@Component({
  templateUrl: 'edit-progress-item-dialog.component.html'
})
export class EditProgressItemDialogComponent extends BaseDialogComponent<EditProgressItemDialogComponent> implements OnInit {

  public formConfig: DataFormConfig;

  public item: ProgressItem;
  public idOfDeletedItem: number;
  public itemWasDeleted: boolean = false;
  public itemWasUpdated: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<EditProgressItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
    this.item = data;

  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.formConfig = this.dependencies.itemServices.progressItemService.buildEditForm(this.item.id)
      .wrapInCard(false)
      .onAfterEdit((response) => {
        this.itemWasUpdated = true;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedItem = response.deletedItemId;
        this.itemWasDeleted = true;
        this.close();
      })
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
