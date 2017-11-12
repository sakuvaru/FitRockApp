// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ExercisesOverviewMenuItem } from '../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Exercise, ExerciseCategoryListWithExercisesCount } from '../../../models';

@Component({
  templateUrl: 'all-exercise-list.component.html'
})
export class AllExerciseListComponent extends BaseComponent implements OnInit {

  private config: DataListConfig<Exercise>;

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
      menuTitle: { key: 'module.exercises.exercises' },
      menuItems: new ExercisesOverviewMenuItem().menuItems,
      componentTitle: { key: 'module.exercises.overview' },
    });

    this.initDataList();
  }

  private initDataList(): void {
    this.config = this.dependencies.webComponentServices.dataListService.dataList<Exercise>(
      searchTerm => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
          .whereLike('ExerciseName', searchTerm);
      },
    )
      .withFields([
        { label: 'module.workouts.exerciseName', value: (item) => item.exerciseName, flex: 40 },
        {
          label: 'shared.updated', value: (item) => {
            return item.exerciseCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.exerciseCategoyService.getCategoriesWithExercisesCount(searchTerm, true)
          .get()
          .map(response => {
            const filters: Filter<ExerciseCategoryListWithExercisesCount>[] = [];
            response.items.forEach(category => {
              filters.push(new Filter({
                filterNameKey: category.codename,
                onFilter: (query) => query.whereEquals('ExerciseCategoryId', category.id),
                count: category.exercisesCount
              }));
            });
            return filters;
          })
          .takeUntil(this.ngUnsubscribe);
      })
      .showAllFilter(true)
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('exercises/preview/') + item.id]))
      .build();
  }
}
