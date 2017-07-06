// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { ExercisesOverviewMenuItem } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';

@Component({
  templateUrl: 'all-exercise-list.component.html'
})
export class AllExerciseListComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Exercise>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }
  
  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'module.exercises.exercises' },
      menuItems: new ExercisesOverviewMenuItem().menuItems,
      componentTitle: { key: 'module.exercises.overview' },
    });

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Exercise>()
      .fields([
        { label: 'module.workouts.exerciseName', value: (item) => { return item.exerciseName }, flex: 40 },
        {
          label: 'shared.updated', value: (item) => {
            return item.exerciseCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .loadResolver((searchTerm, page, pageSize) => {
        return this.dependencies.itemServices.exerciseService.items()
          .include('ExerciseCategory')
          .whereEquals('IsGlobal', true)
          .pageSize(pageSize)
          .page(page)
          .whereLike('ExerciseName', searchTerm)
          .get()
      })
      .onBeforeLoad(() => super.startLoader())
      .onAfterLoad(() => super.stopLoader())
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('exercises/preview/') + item.id]))
      .build();
  }
}