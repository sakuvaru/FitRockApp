// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DietsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { DietCategoryWithDietsCountDto, Diet, DietCategory } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'client-diets.component.html'
})
export class ClientDietsComponent extends BaseComponent implements OnInit {

  public config: DataTableConfig;

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
      componentTitle: { key: 'module.diets.submenu.clientDiets' },
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
          .whereNotNull('ClientId');
      },
    )
      .withFields(
      [
        {
          value: (item) => item.dietName,
          name: (item) => super.translate('module.diets.dietName'),
          sortKey: 'DietName'
        },
        {
          value: (item) => {
            if (item.client) {
              return item.client.getFullName();
            }
            return '';
          },
          name: (item) => super.translate('module.diets.createdForClient'),
          sortKey: 'Client.FirstName'
        },
        {
          value: (item) => item.dietCategory.categoryName,
          name: (item) => super.translate('module.diets.dietCategory'),
          sortKey: 'DietCategory.CategoryName'
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated'
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
              name: Observable.of(category.codename),
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
