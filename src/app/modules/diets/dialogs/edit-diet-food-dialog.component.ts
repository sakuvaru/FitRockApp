// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Food, DietFood } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-diet-food-dialog.component.html'
})
export class EditDietFoodDialogComponent extends BaseComponent implements OnInit {

  private dietFoodForm: FormConfig<DietFood>;

  // public because it is accessed by parent component
  public dietFood: DietFood;

  public idOfDeletedDietFood: number;
  public dietFoodWasDeleted: boolean = false;

  private customSaveButtonSubject: Subject<void> = new Subject<void>();
  private customDeleteButtonSubject: Subject<void> = new Subject<void>();
  private formIsValid: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    super.isDialog();

    this.dietFood = data;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.editForm(this.dietFood.id)
      .onAfterUpdate((response) => {
        this.dietFood = response.item;
        this.close();
      })
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onAfterDelete((response) => {
        this.idOfDeletedDietFood = response.deletedItemId;
        this.dietFoodWasDeleted = true;
        this.close();
      })
      .build();
  }

  private onStatusChanged(valid: boolean): void {
    this.formIsValid = valid;
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}