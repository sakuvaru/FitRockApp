import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Exercise } from '../../../models';

@Component({
  selector: 'mod-my-exercise-list',
  templateUrl: 'my-exercise-list.component.html'
})
export class MyExerciseListComponent extends BaseModuleComponent implements OnInit {

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
    this.config = this.dependencies.itemServices.exerciseService.buildDataTable(
      (query, search) => {
        return query
          .include('ExerciseCategory')
          .byCurrentUser()
          .whereLike('ExerciseName', search);
      },
    )
      .withFields([
        {
          name: (item) => super.translate('module.exercises.exerciseName'),
          value: (item) => item.exerciseName,
          sortKey: 'ExerciseName',
          hideOnSmallScreen: false
        },
        {
          name: (item) => super.translate('module.exercises.exerciseCategory'),
          value: (item) => super.translate('module.exerciseCategories.categories.' + item.exerciseCategory.codename),
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
      search =>
        this.dependencies.itemServices.exerciseCategoyService.getCategoriesWithExercisesCount(search, false)
          .get()
          .map(response => {
            const filters: IDynamicFilter<Exercise>[] = [];
            response.items.forEach(category => {
              filters.push(({
                guid: category.id.toString(),
                name: super.translate('module.exerciseCategories.categories.' + category.codename),
                query: (query) => query.whereEquals('ExerciseCategoryId', category.id),
                count: category.exercisesCount
              }));
            });
            return filters;
          })
      )
      .onClick((item) => super.navigate([super.getTrainerUrl('exercises/preview/') + item.id]))
      .build();
  }
}
