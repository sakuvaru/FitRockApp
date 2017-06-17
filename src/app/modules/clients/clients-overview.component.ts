// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../lib/web-components';
import { User } from '../../models';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent {

  private config: DataTableConfig<User>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
    this.dependencies.translateService.get('menu.clients').subscribe(key => this.setSubtitle(key));

    this.config = this.dependencies.dataTableService.dataTable<User>()
      .fields([
        { label: 'Klient', value: (item) => { return item.getFullName() }, flex: 40 },
        { label: 'E-mail', value: (item) => { return item.email }, isSubtle: true, align: AlignEnum.Right },
      ])
      .loadResolver((searchTerm, page, pageSize) => {
        return this.dependencies.userService.clients()
          .pageSize(pageSize)
          .page(page)
          .WhereLikeMultiple(["FirstName", "LastName"], searchTerm)
          .get()
      })
      .showPager(true)
      .showSearch(true)
      .showHeader(false)
      .pagerSize(7)
      .urlResolver((item) => this.getTrainerUrl('clients/view') + '/' + item.id)
      .avatarUrlResolver((item) => 'https://semantic-ui.com/images/avatar/large/elliot.jpg')
      .build();
  }
}