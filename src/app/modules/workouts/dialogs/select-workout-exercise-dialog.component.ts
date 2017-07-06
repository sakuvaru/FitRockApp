// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'select-workout-exercise-dialog.component.html'
})
export class SelectWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private selectable: boolean = true;
  private config: DataTableConfig<Exercise>;
  private workoutId: number;

  public selectedExercise: Exercise;

  private chipAllSelected: boolean = true;
  private chipMyExercisesSelected: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    this.workoutId = data;
  }

  ngOnInit() {
    super.ngOnInit();

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Exercise>()
      .fields([
        {
          label: 'module.workouts.exerciseName',
          value: (item) => { return item.exerciseName },
          flex: 60
        },
        {
          label: 'module.workouts.exerciseCategory',
          value: (item) => { return item.exerciseCategory.categoryName },
          flex: 40,
          isSubtle: true,
          align: AlignEnum.Right,
          hideOnSmallScreens: true
        },
      ])
      .loadResolver((searchTerm, page, pageSize) => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
          .pageSize(pageSize)
          .page(page)
          .whereLike('ExerciseName', searchTerm)
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .pagerSize(5)
      .onBeforeLoad(() => super.startGlobalLoader())
      .onAfterLoad(() => super.stopGlobalLoader())
      .showPager(true)
      .showSearch(true)
      .onClick((item: Exercise) => {
        // assign selected exercise
        this.selectedExercise = item;
        this.close();
      })
      .build();
  }


  private handleSelectAll(): void {
    this.chipAllSelected = !this.chipAllSelected;
    this.chipMyExercisesSelected = !this.chipMyExercisesSelected;
  }

  private handleSelectMyExercises(): void {
    this.chipAllSelected = !this.chipAllSelected;
    this.chipMyExercisesSelected = !this.chipMyExercisesSelected;
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}