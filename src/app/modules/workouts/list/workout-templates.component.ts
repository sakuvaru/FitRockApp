// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Workout, WorkoutCategoryListWithWorkoutsCount } from '../../../models';

@Component({
  templateUrl: 'workout-templates.component.html'
})
export class WorkoutTemplatesComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Workout>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      autoInitComponent: true,
      menuTitle: { key: 'menu.workouts' },
      menuItems: new WorkoutsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.workouts.submenu.workoutTemplates' },
    });

    this.initDataTable();
  }

  private initDataTable(): void {
    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Workout>()
      .fields([
        { label: 'module.workouts.workoutName', value: (item) => { return item.workoutName }, flex: 40 },
        {
          label: 'shared.updated', value: (item) => {
            return item.workoutCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .loadQuery(searchTerm => {
        return this.dependencies.itemServices.workoutService.items()
          .include('WorkoutCategory')
          .byCurrentUser()
          .whereLike('WorkoutName', searchTerm)
          .whereNullOrEmpty('ClientId')
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.workoutCategoryService.getCategoriesWithWorkoutTemplatesCount(searchTerm)
          .get()
          .map(response => {
            var filters: Filter<WorkoutCategoryListWithWorkoutsCount>[] = [];
            response.items.forEach(category => {
              filters.push(new Filter({
                filterNameKey: category.codename,
                onFilter: (query) => query.whereEquals('WorkoutCategoryId', category.id),
                count: category.workoutsCount
              }));
            });
            return filters;
          })
          .takeUntil(this.ngUnsubscribe)
      })
      .showAllFilter(true)
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onClick((item) => super.navigate([super.getTrainerUrl('workouts/edit-plan/') + item.id]))
      .build();
  }
}