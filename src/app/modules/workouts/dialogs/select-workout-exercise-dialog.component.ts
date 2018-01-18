import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseDialogComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Exercise } from '../../../models';

@Component({
  templateUrl: 'select-workout-exercise-dialog.component.html'
})
export class SelectWorkoutExerciseDialogComponent extends BaseDialogComponent<SelectWorkoutExerciseDialogComponent> implements OnInit {

  public selectable: boolean = true;
  public config: DataTableConfig;

  public selectedExercise: Exercise;
  public openAddCustomExerciseDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<SelectWorkoutExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
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
          value: (item) =>  super.translate('module.exerciseCategories.categories.' + item.exerciseCategory.codename),
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
                name: super.translate('module.exerciseCategories.categories.' + category.codename),
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
