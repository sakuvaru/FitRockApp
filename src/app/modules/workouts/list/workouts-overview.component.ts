// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Workout, WorkoutCategoryListWithWorkoutsCount } from '../../../models';

@Component({
  templateUrl: 'workouts-overview.component.html'
})
export class WorkoutsOverviewComponent extends BaseComponent implements OnInit {

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
      componentTitle: { key: 'module.workouts.overview' },
    });

    /*
    this.dependencies.itemServices.workoutCategoryService.getCategoriesWithWorkoutsCount()
      .get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
        var filters: Filter<Workout>[] = [];
        response.items.forEach(category => {
          filters.push({filterNameKey: category.codename, onFilter: (query) => query.whereEquals('WorkoutCategoryId', category.id)});
        });

        this.initDataTable(filters);
      });
      */

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