import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseDialogComponent, ComponentDependencyService } from '../../../../core';
import { DietFood } from '../../../../models';

@Component({
  templateUrl: 'food-list-dialog.component.html'
})
export class FoodListDialogComponent extends BaseDialogComponent<FoodListDialogComponent> implements OnInit {

  public dietFoods: DietFood[];

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<FoodListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
    this.dietFoods = data.dietFoods;
  }


  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
