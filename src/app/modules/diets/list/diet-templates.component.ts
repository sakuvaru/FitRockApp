import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Diet } from '../../../models';
import { DietsOverviewMenuItems } from '../menu.items';

@Component({
  templateUrl: 'diet-templates.component.html'
})
export class DietTemplatesComponent extends BaseComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'menu.diets' },
      menuItems: new DietsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.diets.submenu.dietTemplates' },
    });

    this.init();
  }

  private init(): void {
    this.config = this.dependencies.itemServices.dietService.buildDataTable(
      (query, search) => {
        return query
          .includeMultiple(['DietCategory', 'Client'])
          .byCurrentUser()
          .whereLike('DietName', search)
          .whereNull('ClientId');
      },
    )
      .withFields(
      [
        {
          value: (item) => item.dietName,
          name: (item) => super.translate('module.diets.dietName'),
          sortKey: 'DietName',
          hideOnSmallScreen: false
        },
        {
          value: (item) => super.translate('module.dietCategories.categories.' + item.dietCategory.codename),
          name: (item) => super.translate('module.diets.dietCategory'),
          hideOnSmallScreen: true
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated',
          hideOnSmallScreen: true
        }
      ])
      .withDynamicFilters(
      (search) => this.dependencies.itemServices.dietCategoryService.getCategoryCountForDietTemplates(search)
        .get()
        .map(response => {
          const filters: IDynamicFilter<Diet>[] = [];
          response.items.forEach(category => {
            filters.push(({
              guid: category.id.toString(),
              name: super.translate('module.dietCategories.categories.' + category.codename),
              query: (query) => {
                return query.whereEquals('DietCategoryId', category.id);
              },
              count: category.dietsCount
            }));
          });
          return filters;
        })
      )
      .onClick((item) => super.navigate([super.getTrainerUrl('diets/edit-plan/') + item.id]))
      .build();
  }
}
