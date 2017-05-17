// common
import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component
import { ITdDataTableColumn, TdDialogService } from '@covalent/core';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent {

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: 'Id' },
    { name: 'email', label: 'E-mail' },
    { name: 'firstName', label: 'First name' },
    { name: 'lastName', label: 'Last name' },
    { name: 'email', label: 'E-mail' },
  ];

  basicData: any[];

   data: any[] = [
    { sku: '1452-2', item: 'Pork Chops', price: 32.11 },
    { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
  ];
  columns2: ITdDataTableColumn[] = [
    { name: 'sku', label: 'SKU #', tooltip: 'Stock Keeping Unit' },
    { name: 'item', label: 'Item name' },
     { name: 'item', label: 'Item name' },
      { name: 'item', label: 'Item name' },
       { name: 'item', label: 'Item name' },
        { name: 'item', label: 'Item name' },
    { name: 'price', label: 'Price (US$)', numeric: true, format: v => v.toFixed(2) },
  ];


  constructor(
    private _dialogService: TdDialogService,
    protected componentDependencyService: ComponentDependencyService) {
    super(componentDependencyService)

    this.dependencies.userService.getClients().subscribe(clients => this.basicData = clients);
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