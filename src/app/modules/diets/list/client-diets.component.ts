import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BasePageComponent, ComponentDependencyService, ComponentSetup, BaseModuleComponent } from '../../../core';
import { Diet } from '../../../models';

@Component({
  selector: 'mod-client-diets',
  templateUrl: 'client-diets.component.html'
})
export class ClientDietsComponent extends BaseModuleComponent implements OnInit {

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
          .whereNotNull('ClientId');
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
          value: (item) => {
            if (item.client) {
              return item.client.getFullName();
            }
            return '';
          },
          name: (item) => super.translate('module.diets.createdForClient'),
          sortKey: 'Client.FirstName',
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
      (search) => this.dependencies.itemServices.dietCategoryService.getCategoryCountForClientDiets(search)
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
