// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Food } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-food-dialog.component.html'
})
export class AddCustomFoodDialogComponent extends BaseComponent implements OnInit {

  public foodForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newFood: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);

  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.foodForm = this.dependencies.itemServices.foodService.buildInsertForm()
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newFood = response.item;
        this.close();
      }))
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
