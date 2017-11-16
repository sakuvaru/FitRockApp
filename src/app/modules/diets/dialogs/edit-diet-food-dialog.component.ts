// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../web-components/data-list';
import { Food, DietFood } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormConfig, DynamicFormStatus } from '../../../../web-components/dynamic-form';
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
  private formStatus: DynamicFormStatus | undefined;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    

    this.dietFood = data;
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
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.editForm(this.dietFood.id)
      .wrapInCard(false)
      .fieldLabelResolver((field, originalLabel) => {
        if (field.key === 'UnitValue') {
          return this.dependencies.itemServices.foodUnitService.item().byId(this.dietFood.foodId)
            .get()
            .flatMap(response => {
              if (response.isEmpty()) {
                console.warn(`FoodUnit was not found, this should have not happened here`);
                return Observable.of(originalLabel);
              }
              return super.translate('module.foodUnits.' + response.item.unitCode)
                .map(unitTranslation => originalLabel + ' (' + unitTranslation + ')');
            });
        }
        return Observable.of(originalLabel);
      })
      .onAfterUpdate((response) => {
        this.dietFood = response.item;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedDietFood = response.deletedItemId;
        this.dietFoodWasDeleted = true;
        this.close();
      })
      .build();
  }

  private onStatusChanged(status: DynamicFormStatus): void {
    this.formStatus = status;
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
