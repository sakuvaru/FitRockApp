import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { ExercisesOverviewMenuItem } from '../menu.items';

@Component({
  templateUrl: 'my-exercise-list-page.component.html'
})
export class MyExerciseListPageComponent extends BasePageComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'module.exercises.myExercises' },
      menuItems: new ExercisesOverviewMenuItem().menuItems,
      componentTitle: { key: 'module.exercises.overview' },
    });
  }
}
