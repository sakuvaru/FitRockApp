// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Food } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-food-dialog.component.html'
})
export class AddCustomFoodDialogComponent extends BaseComponent implements OnInit {

  private foodForm: FormConfig<Food>;

  /**
   * Accessed by parent component
   */
  public newFood: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)
    super.isDialog();
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(this.getFormObservable());
  }

  private getFormObservable(): Observable<any>{
    return this.dependencies.itemServices.foodService.insertForm()
      .takeUntil(this.ngUnsubscribe)
      .map(form => {
        form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());

        form.onAfterInsert((response => {
          this.newFood = response.item;
          this.close();
        }))

        this.foodForm = form.build();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}