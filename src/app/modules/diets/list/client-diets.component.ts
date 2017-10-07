// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { DietsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Diet, DietCategoryWithDietsCountDto } from '../../../models';

@Component({
  templateUrl: 'client-diets.component.html'
})
export class ClientDietsComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Diet>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    }
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      autoInitComponent: true,
      menuTitle: { key: 'menu.diets' },
      menuItems: new DietsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.diets.submenu.clientDiets' },
    });

    this.initDataTable();
  }

  private initDataTable(): void {
    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Diet>()
      .fields([
        { value: (item) => { return item.dietName }, flex: 40 },
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
      .loadQuery(searchTerm => {
        return this.dependencies.itemServices.dietService.items()
          .includeMultiple(['DietCategory', 'Client'])
          .byCurrentUser()
          .whereLike('DietName', searchTerm)
          .whereNotNull('ClientId')
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.dietCategoryService.getCategoryCountForClientDiets(searchTerm)
          .get()
          .map(response => {
            let filters: Filter<DietCategoryWithDietsCountDto>[] = [];
            response.items.forEach(category => {
              filters.push(new Filter({
                filterNameKey: category.codename,
                onFilter: (query) => query.whereEquals('DietCategoryId', category.id),
                count: category.dietsCount
              }));
            });
            return filters;
          })
          .takeUntil(this.ngUnsubscribe)
      })
      .showAllFilter(true)
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onClick((item) => super.navigate([super.getTrainerUrl('diets/edit-plan/') + item.id]))
      .build();
  }
}