// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Food } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'select-diet-food-dialog.component.html'
})
export class SelectDietFoodDialogComponent extends BaseComponent implements OnInit {

  private selectable: boolean = true;
  private config: DataTableConfig<Food>;

  public selectedFood: Food;
  public openAddCustomFoodDialog: boolean = false;

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

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Food>(
      query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe);
      },
      searchTerm => {
        return this.dependencies.itemServices.foodService.items()
          .include('FoodCategory')
          .whereLike('FoodName', searchTerm);
      },
      [
        {
          value: (item) => item.foodName,
          flex: 60
        },
        {
          value: (item) => 'module.foodCategories.' + item.foodCategory.codename,
          translateValue: true,
          flex: 40,
          isSubtle: true,
          align: AlignEnum.Right,
          hideOnSmallScreens: true
        },
      ]
    )
      .filter(new Filter({ filterNameKey: 'module.diets.allFoods', onFilter: query => query }))
      .filter(new Filter({ filterNameKey: 'module.diets.myFoods', onFilter: query => query.byCurrentUser().whereEquals('IsGlobal', false) }))
      .pagerSize(5)
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .showPager(true)
      .showSearch(true)
      .wrapInCard(false)
      .onClick((item: Food) => {
        // assign selected item
        this.selectedFood = item;
        this.close();
      })
      .build();
  }

  private addCustomFood(): void {
    this.openAddCustomFoodDialog = true;
    this.close();
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
