import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NewChildFoodVirtualModel } from 'app/models';
import { DataFormMultipleChoiceItem } from 'web-components/data-form';

import { BaseDialogComponent, ComponentDependencyService } from '../../../core';

@Component({
  templateUrl: 'edit-food-dish-dialog.component.html'
})
export class EditFoodDishDialogComponent extends BaseDialogComponent<EditFoodDishDialogComponent> implements OnInit {

  public items?: DataFormMultipleChoiceItem<NewChildFoodVirtualModel>[];

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<EditFoodDishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

    this.items = data.items;
  }

  confirm(): void {
    this.close();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
