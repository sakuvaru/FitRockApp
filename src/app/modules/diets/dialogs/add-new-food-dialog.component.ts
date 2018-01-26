import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataFormConfig, DataFormInsertResponse, DataFormComponent } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';

@Component({
  templateUrl: 'add-new-food-dialog.component.html'
})
export class AddNewFoodDialogComponent extends BaseDialogComponent<AddNewFoodDialogComponent> implements OnInit {

  public foodForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newFood?: Food;

  public isFood: boolean;
  public isMeal: boolean;
  public isSupplement: boolean;

  public dataForm?: DataFormComponent;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<AddNewFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
    this.isFood = data.isFood;
    this.isMeal = data.isMeal;
    this.isSupplement = data.isSupplement;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  handleInsert(response: DataFormInsertResponse<Food>): void {
    if (response.item) {
      this.newFood = response.item;
    }
    super.close();
  }
}
