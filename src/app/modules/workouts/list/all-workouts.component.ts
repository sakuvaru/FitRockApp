// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Workout, WorkoutCategoryListWithWorkoutsCount } from '../../../models';

@Component({
  templateUrl: 'all-workouts.component.html'
})
export class AllWorkoutsComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Workout>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'menu.workouts' },
      menuItems: new WorkoutsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.workouts.submenu.allWorkouts' },
    });

    this.initDataTable();
  }

  private initDataTable(): void {
    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Workout>()
      .fields([
        { label: 'module.workouts.workoutName', value: (item) => { return item.workoutName }, flex: 40 },
        {
          label: '-', value: (item) => {
            if (item.client) {
              return item.client.getFullName();
            }
            return '';
          }, isSubtle: true, align: AlignEnum.Left, hideOnSmallScreens: true
        },
        {
          label: 'shared.updated', value: (item) => {
            return item.workoutCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .loadQuery(searchTerm => {
        return this.dependencies.itemServices.workoutService.items()
          .includeMultiple(['WorkoutCategory', 'Client'])
          .byCurrentUser()
          .whereLike('WorkoutName', searchTerm)
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.workoutCategoryService.getCategoriesWithWorkoutsCount(searchTerm)
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
      .onBeforeLoad(() => super.startLoader())
      .onAfterLoad(() => super.stopLoader())
      .onClick((item) => super.navigate([super.getTrainerUrl('workouts/edit-plan/') + item.id]))
      .build();
  }
}