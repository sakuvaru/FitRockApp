import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NewChildFoodVirtualModel } from 'app/models';
import { DataFormMultipleChoiceItem } from 'web-components/data-form';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';

@Component({
  templateUrl: 'edit-food-dish-dialog.component.html'
})
export class EditFoodDishDialogComponent extends BaseComponent implements OnInit {

  public items?: DataFormMultipleChoiceItem<NewChildFoodVirtualModel>[];

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);

    this.items = data.items;
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  confirm(): void {
    this.close();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
