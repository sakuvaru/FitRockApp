// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Workout, WorkoutCategoryListWithWorkoutsCount } from '../../../models';

@Component({
  templateUrl: 'workout-templates.component.html'
})
export class WorkoutTemplatesComponent extends BaseComponent implements OnInit {

  private config: DataListConfig<Workout>;

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
      componentTitle: { key: 'module.workouts.submenu.workoutTemplates' },
    });

    this.initDataList();
  }

  private initDataList(): void {
    this.config = this.dependencies.webComponentServices.dataListService.dataList<Workout>(
      searchTerm => {
        return this.dependencies.itemServices.workoutService.items()
          .include('WorkoutCategory')
          .byCurrentUser()
          .whereLike('WorkoutName', searchTerm)
          .whereNull('ClientId');
      },
    )
      .withFields([
        { label: 'module.workouts.workoutName', value: (item) => item.workoutName, flex: 40 },
        {
          label: 'shared.updated', value: (item) => {
            return item.workoutCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.workoutCategoryService.getCategoryCountForWorkoutTemplates(searchTerm)
          .get()
          .map(response => {
            const filters: Filter<WorkoutCategoryListWithWorkoutsCount>[] = [];
            response.items.forEach(category => {
              filters.push(new Filter({
                filterNameKey: category.codename,
                onFilter: (query) => query.whereEquals('WorkoutCategoryId', category.id),
                count: category.workoutsCount
              }));
            });
            return filters;
          })
          .takeUntil(this.ngUnsubscribe);
      })
      .showAllFilter(true)
      .onClick((item) => super.navigate([super.getTrainerUrl('workouts/edit-plan/') + item.id]))
      .build();
  }
}
