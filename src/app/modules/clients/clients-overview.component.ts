// common
import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component
import { ITdDataTableColumn, TdDialogService  } from '@covalent/core';

@Component({
    templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent{

   constructor(
       private _dialogService: TdDialogService,
       protected componentDependencyService: ComponentDependencyService){
      super(componentDependencyService)

   }

   initAppData(): AppData{
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
columns: ITdDataTableColumn[] = [
    { name: 'id', label: 'ClientId' },
  ];

  basicData: any[] = [
      {
        'id': 1,
        'food': {
          'name': 'Frozen yogurt',
          'type': 'Ice cream',
        },
        'calories': 159.0,
        'fat': 6.0,
        'carbs': 24.0,
        'protein': 4.0,
        'sodium': 87.0,
        'calcium': 14.0,
        'iron': 1.0,
        'comments': 'I love froyo!',
      }, {
        'id': 2,
        'food': {
          'name': 'Ice cream sandwich',
          'type': 'Ice cream',
        },
        'calories': 237.0,
        'fat': 9.0,
        'carbs': 37.0,
        'protein': 4.3,
        'sodium': 129.0,
        'calcium': 8.0,
        'iron': 1.0,
      }, {
        'id': 3,
        'food': {
          'name': 'Eclair',
          'type': 'Pastry',
        },
        'calories':  262.0,
        'fat': 16.0,
        'carbs': 24.0,
        'protein':  6.0,
        'sodium': 337.0,
        'calcium':  6.0,
        'iron': 7.0,
      },
    ];
}