import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';

@Component({
  templateUrl: 'food-dish-amount.component.html'
})
export class FoodDishAmountDialogComponent extends BaseComponent implements OnInit {

  public unitCode?: string;
  public amount?: number;

  constructor(
    private dialogRef: MatDialogRef<FoodDishAmountDialogComponent>,
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    this.unitCode = data.unitCode;
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  cancel(): void {
    this.amount = undefined;
    this.close();
  }

  confirm(): void {
    this.close();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
