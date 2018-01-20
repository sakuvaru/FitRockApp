import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Workout } from '../../../models';

@Component({
  selector: 'mod-client-workouts',
  templateUrl: 'client-workouts.component.html'
})
export class ClientWorkoutsComponent extends BaseModuleComponent implements OnInit {

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
          value: (item) => super.translate('module.workoutCategories.categories.' + item.workoutCategory.codename),
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
              name: super.translate('module.workoutCategories.categories.' + category.codename), 
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
