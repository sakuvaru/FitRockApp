// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';

@Component({
  templateUrl: 'add-workout-exercise-dialog.component.html'
})
export class AddWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Exercise>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
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
          align: AlignEnum.Right
        },
      ])
      .loadResolver((searchTerm, page, pageSize) => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
          .pageSize(pageSize)
          .page(page)
          .whereLike('ExerciseName', searchTerm)
          .get()
      })
      .pagerSize(5)
      .onBeforeLoad(() => this.registerFullScreenLoader())
      .onAfterLoad(() => this.resolveFullScreenLoader())
      .showPager(true)
      .showSearch(true)
      .build();
  }

}