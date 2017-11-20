// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DietsOverviewMenuItems } from '../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Diet, DietCategoryWithDietsCountDto } from '../../../models';

@Component({
  templateUrl: 'diet-templates.component.html'
})
export class DietTemplatesComponent extends BaseComponent implements OnInit {

  public config: DataListConfig<Diet>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup | null {
    return {
      initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'menu.diets' },
      menuItems: new DietsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.diets.submenu.dietTemplates' },
    });

    this.initDataList();
  }

  private initDataList(): void {

    this.config = this.dependencies.webComponentServices.dataListService.dataList<Diet>(
      searchTerm => {
        return this.dependencies.itemServices.dietService.items()
          .includeMultiple(['DietCategory', 'Client'])
          .byCurrentUser()
          .whereLike('DietName', searchTerm)
          .whereNull('ClientId');
      },
    )
      .withFields([
        { value: (item) => item.dietName, flex: 40 },
        {
          value: (item) => {
            if (item.client) {
              return item.client.getFullName();
            }
            return '';
          }, isSubtle: true, align: AlignEnum.Left, hideOnSmallScreens: true
        },
        {
          value: (item) => {
            return item.dietCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.dietCategoryService.getCategoryCountForDietTemplates(searchTerm)
          .get()
          .map(response => {
            const filters: Filter<DietCategoryWithDietsCountDto>[] = [];
            response.items.forEach(category => {
              filters.push(new Filter({
                filterNameKey: category.codename,
                onFilter: (query) => query.whereEquals('DietCategoryId', category.id),
                count: category.dietsCount
              }));
            });
            return filters;
          })
          .takeUntil(this.ngUnsubscribe);
      })
      .showAllFilter(true)
      .onClick((item) => super.navigate([super.getTrainerUrl('diets/edit-plan/') + item.id]))
      .build();
  }
}
