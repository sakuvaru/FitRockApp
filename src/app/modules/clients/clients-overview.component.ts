// common
import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component
import { User } from '../../models/user.class';
import { TdDialogService } from '@covalent/core';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent {

  clients: User[];

  constructor(
    private _dialogService: TdDialogService,
    protected componentDependencyService: ComponentDependencyService) {
    super(componentDependencyService)

    this.dependencies.userService.getClients().subscribe(clients => this.clients = clients);
  }

  initAppData(): AppData {
    return new AppData("Clients");
  }

  openPrompt(row: any, name: string): void {
    this._dialogService.openPrompt({
      message: 'Enter comment?',
      value: row[name],
    }).afterClosed().subscribe((value: any) => {
      if (value !== undefined) {
        row[name] = value;
      }
    });
  }

}