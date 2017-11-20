// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'select-workout-exercise-dialog.component.html'
})
export class SelectWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  public selectable: boolean = true;
  public config: DataListConfig<Exercise>;

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

    this.config = this.dependencies.webComponentServices.dataListService.dataList<Exercise>(
      searchTerm => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
          .whereLike('ExerciseName', searchTerm);
      },

    )
      .withFields([
        {
          label: 'module.workouts.exerciseName',
          value: (item) => item.exerciseName,
          flex: 60
        },
        {
          label: 'module.workouts.exerciseCategory',
          value: (item) => item.exerciseCategory.categoryName,
          flex: 40,
          isSubtle: true,
          align: AlignEnum.Right,
          hideOnSmallScreens: true
        },
      ])
      .filter(new Filter({ filterNameKey: 'module.workouts.allExercises', onFilter: query => query }))
      .filter(new Filter({ filterNameKey: 'module.workouts.myExercises', onFilter: query => query.byCurrentUser().whereEquals('IsGlobal', false) }))
      .pagerSize(5)
      .showPager(true)
      .showSearch(true)
      .wrapInCard(false)
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
