// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../../web-components/data-list';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProgressItemType } from '../../../../models';
import { FormConfig } from '../../../../../web-components/dynamic-form';

@Component({
  templateUrl: 'select-progress-type-dialog.component.html'
})
export class SelectProgressTypeDialogComponent extends BaseComponent implements OnInit {

  private config: DataListConfig<ProgressItemType>;
  public selectedItem: ProgressItemType;
  public openAddCustomProgressTypeDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);

  }

  setup(): ComponentSetup | null {
    return {
      initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.initDataList();
  }

  private initDataList(): void {
    this.config = this.dependencies.webComponentServices.dataListService.dataList<ProgressItemType>(
      (searchTerm) => {
        return this.dependencies.itemServices.progressItemTypeService.getProgressItemTypesSelection(this.dependencies.authenticatedUserService.getUserId())
          .include('ProgressItemUnit');
      },
    )
      .withFields([
        {
          value: (item: ProgressItemType) => item.isGlobal ? super.translate('module.progressItemTypes.globalTypes.' + item.typeName) : item.typeName,
          flex: 40
        },
        {
          value: (item) => super.translate('module.progressItemUnits.' + item.progressItemUnit.unitCode.toString()),
          isSubtle: true,
          align: AlignEnum.Right,
          hideOnSmallScreens: true
        },
      ])
      .wrapInCard(false)
      .showPager(true)
      .showSearch(false)
      .pagerSize(5)
      .onClick((item) => {
        this.selectedItem = item;
        this.close();
      })
      .build();
  }

  private addCustomProgressType(): void {
    this.openAddCustomProgressTypeDialog = true;
    this.close();
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
