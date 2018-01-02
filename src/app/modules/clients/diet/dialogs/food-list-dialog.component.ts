import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../../core';
import { DietFood } from '../../../../models';

@Component({
  templateUrl: 'food-list-dialog.component.html'
})
export class FoodListDialogComponent extends BaseComponent implements OnInit {

  public dietFoods: DietFood[];

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    this.dietFoods = data.dietFoods;
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
