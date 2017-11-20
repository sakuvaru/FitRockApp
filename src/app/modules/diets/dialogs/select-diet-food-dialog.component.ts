// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Food } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'select-diet-food-dialog.component.html'
})
export class SelectDietFoodDialogComponent extends BaseComponent implements OnInit {

  public selectable: boolean = true;
  public config: DataListConfig<Food>;

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

    this.config = this.dependencies.webComponentServices.dataListService.dataList<Food>(
      searchTerm => {
        return this.dependencies.itemServices.foodService.items()
          .include('FoodCategory')
          .whereLike('FoodName', searchTerm);
      },
    )
      .withFields([
        {
          value: (item) => item.foodName,
          flex: 60
        },
        {
          value: (item) => super.translate('module.foodCategories.' + item.foodCategory.codename),
          flex: 40,
          isSubtle: true,
          align: AlignEnum.Right,
          hideOnSmallScreens: true
        },
      ])
      .filter(new Filter({ filterNameKey: 'module.diets.allFoods', onFilter: query => query }))
      .filter(new Filter({ filterNameKey: 'module.diets.myFoods', onFilter: query => query.byCurrentUser().whereEquals('IsGlobal', false) }))
      .pagerSize(5)
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

  public addCustomFood(): void {
    this.openAddCustomFoodDialog = true;
    this.close();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
