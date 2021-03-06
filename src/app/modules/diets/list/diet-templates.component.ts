import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Diet } from '../../../models';

@Component({
  selector: 'mod-diet-templates',
  templateUrl: 'diet-templates.component.html'
})
export class DietTemplatesComponent extends BaseModuleComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
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
      .onClick((item) => this.dependencies.coreServices.navigateService.dietPlanPage(item.id).navigate())
      .build();
  }
}
