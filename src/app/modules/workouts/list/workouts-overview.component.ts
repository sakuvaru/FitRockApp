// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutsOverviewMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Workout } from '../../../models';

@Component({
  templateUrl: 'workouts-overview.component.html'
})
export class WorkoutsOverviewComponent extends BaseComponent {

  private config: DataTableConfig<Workout>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)

    this.setConfig({
      menuTitle: { key: 'menu.workouts' },
      menuItems: new WorkoutsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.workouts.overview' },
    });

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Workout>()
      .fields([
        { label: 'module.workouts.workoutName', value: (item) => { return item.workoutName }, flex: 40 },
        {
          label: 'shared.updated', value: (item) => {
            var date = new Date(item.updated);
            return date.toLocaleDateString();
          }, isSubtle: true, align: AlignEnum.Right
        },
      ])
      .loadResolver((searchTerm, page, pageSize) => {
        return this.dependencies.itemServices.workoutService.items()
          .byCurrentUser()
          .pageSize(pageSize)
          .page(page)
          .whereLike('WorkoutName', searchTerm)
          .get()
      })
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .urlResolver((item) => this.getTrainerUrl('workouts/view/') + item.id)
      .avatarUrlResolver((item) => 'https://semantic-ui.com/images/avatar/large/elliot.jpg')
      .build();
  }
}