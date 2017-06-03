// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
import { DataTableField, DataTableConfig, AlignEnum } from '../../../lib/web-components.lib';
import { PageSize, Page, WhereLikeMultiple } from '../../../lib/repository.lib';
import { User } from '../../models';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent {

  private fields: DataTableField<User>[] = [
    { label: 'Klient', value: (item) => { return item.getFullName() }, flex: 40 },
    { label: 'E-mail', value: (item) => { return item.email }, isSubtle: true, align: AlignEnum.Right },
  ];

  private config: DataTableConfig<User> = new DataTableConfig<User>({
    loadItems: (searchTerm: string, page: number, pageSize: number) => {
      return this.dependencies.userService.getClients(
        [
          new PageSize(pageSize), new Page(page), new WhereLikeMultiple(["FirstName", "LastName"], searchTerm)
        ])
    },
    showPager: true,
    showSearch: true,
    showHeader: false,
    pagerSize: 7,
    url: (item) => 'client/clients/view/' + item.id,
    avatarUrl: (item) => 'https://semantic-ui.com/images/avatar/large/elliot.jpg'
  });

  constructor(
    protected componentDependencyService: ComponentDependencyService) {
    super(componentDependencyService)
  }

  initAppData(): AppData {
    return new AppData({
      subTitle: "Klienti"
    });
  }
}