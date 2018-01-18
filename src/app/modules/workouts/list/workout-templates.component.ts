// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { Workout, WorkoutCategoryListWithWorkoutsCount } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'workout-templates.component.html'
})
export class WorkoutTemplatesComponent extends BasePageComponent implements OnInit {

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
      menuTitle: { key: 'menu.workouts' },
      menuItems: new WorkoutsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.workouts.submenu.workoutTemplates' },
    });

    this.init();
  }

  private init(): void {
    this.config = this.dependencies.itemServices.workoutService.buildDataTable(
      (query, search) => {
        return query
          .include('WorkoutCategory')
          .byCurrentUser()
          .whereLike('WorkoutName', search)
          .whereNull('ClientId');
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
      (search) => this.dependencies.itemServices.workoutCategoryService.getCategoryCountForWorkoutTemplates(search)
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
