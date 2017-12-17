// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'select-workout-exercise-dialog.component.html'
})
export class SelectWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  public selectable: boolean = true;
  public config: DataTableConfig;

  public selectedExercise: Exercise;
  public openAddCustomExerciseDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);

  }

  setup(): ComponentSetup | null {
    return {
      initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.config = this.dependencies.itemServices.exerciseService.buildDataTable(
      (query, search) => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
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
          value: (item) => item.exerciseCategory.categoryName,
          sortKey: 'ExerciseCategory.CategoryName',
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
      .renderPager(false)
      .pageSize(5)
      .onClick((item: Exercise) => {
        // assign selected exercise
        this.selectedExercise = item;
        this.close();
      })
      .build();
  }

  public addCustomExercise(): void {
    this.openAddCustomExerciseDialog = true;
    this.close();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
