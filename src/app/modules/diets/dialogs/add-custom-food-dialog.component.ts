// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../web-components/data-list';
import { Food } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormConfig, DynamicFormStatus } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-food-dialog.component.html'
})
export class AddCustomFoodDialogComponent extends BaseComponent implements OnInit {

  public foodForm: FormConfig<Food>;

  public customSaveButtonSubject: Subject<void> = new Subject<void>();
  public customDeleteButtonSubject: Subject<void> = new Subject<void>();
  public formStatus: DynamicFormStatus | undefined;
  
  /**
   * Accessed by parent component
   */
  public newFood: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
    
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.foodForm = this.dependencies.itemServices.foodService.insertForm()
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newFood = response.item;
        this.close();
      }))
      .build();
  }

  public onStatusChanged(status: DynamicFormStatus): void {
    this.formStatus = status;
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
