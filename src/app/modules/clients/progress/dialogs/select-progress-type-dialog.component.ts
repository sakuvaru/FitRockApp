import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataTableConfig } from '../../../../../web-components/data-table';
import { BaseDialogComponent, ComponentDependencyService, ComponentSetup } from '../../../../core';
import { ProgressItemType } from '../../../../models';

@Component({
  templateUrl: 'select-progress-type-dialog.component.html'
})
export class SelectProgressTypeDialogComponent extends BaseDialogComponent<SelectProgressTypeDialogComponent> implements OnInit {

  public config: DataTableConfig;
  public selectedItem: ProgressItemType;
  public openAddCustomProgressTypeDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<SelectProgressTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.initDataList();
  }

  private initDataList(): void {
    this.config = this.dependencies.webComponentServices.dataTableService.dataTable(
      (search) => {
        return this.dependencies.itemServices.progressItemTypeService.getProgressItemTypesSelection(this.dependencies.authenticatedUserService.getUserId())
          .include('ProgressItemUnit');
      },
    )
      .withFields([
        {
          value: (item) => item.isGlobal ? super.translate('module.progressItemTypes.globalTypes.' + item.typeName) : item.typeName,
          name: (item) => super.translate('module.progressItemTypes.typeName'),
          hideOnSmallScreen: false
        },
        {
          value: (item) => super.translate('module.progressItemUnits.' + item.progressItemUnit.unitCode.toString()),
          name: (item) => super.translate('module.progressItemTypes.unit'),
          hideOnSmallScreen: true
        }
      ])
      .pageSize(5)
      .renderPager(false)
      .onClick((item) => {
        this.selectedItem = item;
        this.close();
      })
      .build();
  }

  public addCustomProgressType(): void {
    this.openAddCustomProgressTypeDialog = true;
    this.close();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
