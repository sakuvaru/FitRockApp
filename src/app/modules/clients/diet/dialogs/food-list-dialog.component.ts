// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { MAT_DIALOG_DATA } from '@angular/material';
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

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
}

  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
