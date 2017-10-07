// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../../web-components/data-table';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProgressItemType } from '../../../../models';
import { FormConfig } from '../../../../../web-components/dynamic-form';

@Component({
  templateUrl: 'select-progress-type-dialog.component.html'
})
export class SelectProgressTypeDialog extends BaseComponent implements OnInit {

  private config: DataTableConfig<ProgressItemType>;
  public selectedItem: ProgressItemType;
  public openAddCustomProgressTypeDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    }
}

  ngOnInit() {
    super.ngOnInit();

    this.initDataTable();
  }

  private initDataTable(): void {
    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<ProgressItemType>()
      .fields([
        {
          translateValue: true,
          value: (item) => { return item.isGlobal ? 'module.progressItemTypes.globalTypes.' + item.typeName : item.typeName }, flex: 40
        },
        {
          translateValue: true,
          value: (item) => {
            return 'module.progressItemUnits.' + item.progressItemUnit.unitCode.toString();
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .loadQuery(searchTerm => {
        return this.dependencies.itemServices.progressItemTypeService.getProgressItemTypesSelection(this.dependencies.authenticatedUserService.getUserId())
          .include('ProgressItemUnit')
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .wrapInCard(false)
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
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