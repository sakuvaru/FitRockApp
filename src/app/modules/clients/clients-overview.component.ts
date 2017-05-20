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

// required by component
import { User } from '../../models/user.class';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent {

  private clients: User[];

  private fields: DataTableField<User>[] = [
    { label: 'Klient', value: (item) => { return item.getFullName() }, flex: 40 },
    { label: 'E-mail', value: (item) => { return item.email }, isSubtle: true, align: AlignEnum.Right},
  ];

  private config: DataTableConfig<User> = new DataTableConfig<User>({
    showHeader: true,
    showSearch: true,
    url: (item) => {
      return '/client/clients/view/' + item.id
    }
  });

  constructor(
    protected componentDependencyService: ComponentDependencyService) {
    super(componentDependencyService)

    this.dependencies.userService.getClients().subscribe(clients => this.clients = clients);
  }

  initAppData(): AppData {
    return new AppData("Clients");
  }
}