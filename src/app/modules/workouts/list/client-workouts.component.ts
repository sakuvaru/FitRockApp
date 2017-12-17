// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { Workout, WorkoutCategoryListWithWorkoutsCount } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'client-workouts.component.html'
})
export class ClientWorkoutsComponent extends BaseComponent implements OnInit {

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
      menuTitle: { key: 'menu.workouts' },
      menuItems: new WorkoutsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.workouts.submenu.clientWorkouts' },
    });

    this.init();
  }

  private init(): void {
    this.config = this.dependencies.itemServices.workoutService.buildDataTable(
      (query, search) => {
        return query
          .includeMultiple(['WorkoutCategory', 'Client'])
          .byCurrentUser()
          .whereLike('WorkoutName', search)
          .whereNotNull('ClientId');
      },
    )
      .withFields([
        {
          name: (item) => super.translate('module.workouts.workoutName'),
          value: (item) => item.workoutName,
          sortKey: 'WorkoutName',
          hideOnSmallScreen: false
        },
        {
          name: (item) => super.translate('module.workouts.workoutForClient'),
          value: (item) => {
            if (item.client) {
              return item.client.getFullName();
            }
            return '';
          },
          hideOnSmallScreen: true
        },
        {
          name: (item) => super.translate('module.workouts.workoutCategory'),
          value: (item) => item.workoutCategory.categoryName,
          sortKey: 'WorkoutCategory.CategoryName',
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
      (search) => this.dependencies.itemServices.workoutCategoryService.getCategoryCountForClientWorkouts(search)
        .get()
        .map(response => {
          const filters: IDynamicFilter<Workout>[] = [];
          response.items.forEach(category => {
            filters.push(({
              guid: category.id.toString(),
              name: Observable.of(category.codename),
              query: (query) => {
                return query.whereEquals('WorkoutCategoryId', category.id);
              },
              count: category.workoutsCount
            }));
          });
          return filters;
        })
      )
      .onClick((item) => super.navigate([super.getTrainerUrl('workouts/edit-plan/') + item.id]))
      .build();
  }
}
