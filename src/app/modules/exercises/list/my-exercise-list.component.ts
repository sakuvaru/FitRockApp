// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ExercisesOverviewMenuItem } from '../menu.items';
import { IDynamicFilter, DataTableConfig } from '../../../../web-components/data-table';
import { Exercise, ExerciseCategoryListWithExercisesCount } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'my-exercise-list.component.html'
})
export class MyExerciseListComponent extends BaseComponent implements OnInit {

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
      menuTitle: { key: 'module.exercises.myExercises' },
      menuItems: new ExercisesOverviewMenuItem().menuItems,
      componentTitle: { key: 'module.exercises.overview' },
    });

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
          sortKey: 'ExerciseName'
        },
        {
          name: (item) => super.translate('module.exercises.exerciseCategory'),
          value: (item) => item.exerciseCategory.categoryName,
          sortKey: 'ExerciseCategory.CategoryName'
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated'
        }
      ])
      .withDynamicFilters(
      search =>
        this.dependencies.itemServices.exerciseCategoyService.getCategoriesWithExercisesCount(search, true)
          .get()
          .map(response => {
            const filters: IDynamicFilter<Exercise>[] = [];
            response.items.forEach(category => {
              filters.push(({
                guid: category.id.toString(),
                name: Observable.of(category.codename),
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
