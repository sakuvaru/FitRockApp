// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/web-components/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { DataTableField } from '../../core/web-components/data-table/data-table-field.class';
import { DataTableConfig } from '../../core/web-components/data-table/data-table.config';
import { AlignEnum } from '../../core/web-components/data-table/align-enum';
import {
  WhereEquals, OrderBy, OrderByDescending, Limit, PageSize, Page,
  Include, IncludeMultiple, WhereLike, WhereLikeMultiple
} from '../../repository/models/options';
import { Observable } from 'rxjs/Observable';

// required by component
import { User } from '../../models/user.class';

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