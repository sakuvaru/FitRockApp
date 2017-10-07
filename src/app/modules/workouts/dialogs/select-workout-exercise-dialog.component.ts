// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'select-workout-exercise-dialog.component.html'
})
export class SelectWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private selectable: boolean = true;
  private config: DataTableConfig<Exercise>;

  public selectedExercise: Exercise;
  public openAddCustomExerciseDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    }
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
      .loadQuery(searchTerm => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
          .whereLike('ExerciseName', searchTerm)
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .filter(new Filter({ filterNameKey: 'module.workouts.allExercises', onFilter: query => query }))
      .filter(new Filter({ filterNameKey: 'module.workouts.myExercises', onFilter: query => query.byCurrentUser().whereEquals('IsGlobal', false) }))
      .pagerSize(5)
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
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

  private addCustomExercise(): void {
    this.openAddCustomExerciseDialog = true;
    this.close();
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}