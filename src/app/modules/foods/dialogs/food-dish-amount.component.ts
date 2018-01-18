import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseDialogComponent, ComponentDependencyService } from '../../../core';

@Component({
  templateUrl: 'food-dish-amount.component.html'
})
export class FoodDishAmountDialogComponent extends BaseDialogComponent<FoodDishAmountDialogComponent> implements OnInit {

  public unitCode?: string;
  public amount?: number;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<FoodDishAmountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
    this.unitCode = data.unitCode;
  }

  cancel(): void {
    this.amount = undefined;
    super.close();
  }

  confirm(): void {
    super.close();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
