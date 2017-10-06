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
import { stringHelper } from '../../../../lib/utilities'

@Component({
  templateUrl: 'add-diet-food-dialog.component.html'
})
export class AddDietFoodDialogComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<DietFood>;
  private dietId: number;
  private food: Food;

  private dietFoodForm: FormConfig<DietFood>;

  private customSaveButtonSubject: Subject<void> = new Subject<void>();
  private customDeleteButtonSubject: Subject<void> = new Subject<void>();
  private formIsValid: boolean = false;

  /**
   * Accessed by parent component
   */
  public newDietFood: DietFood;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    super.isDialog();

    this.dietId = data.dietId;
    this.food = data.food;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.insertForm()
      .fieldValueResolver((fieldName, value) => {
        if (fieldName === 'FoodId') {
          return this.food.id;
        }
        else if (fieldName === 'DietId') {
          return this.dietId;
        }
        return value;
      })
      .fieldLabelResolver((field, originalLabel) => {
        if (field.key === 'UnitValue'){
          return this.dependencies.itemServices.foodUnitService.item().byId(this.food.foodUnitId)
            .get()
            .flatMap(response => {
              if (response.isEmpty()){
                console.warn(`FoodUnit with id '${this.food.foodUnitId}' was not found, this should have not happened here`);
                return Observable.of(originalLabel);
              }
              return super.translate('module.foodUnits.' + response.item.unitCode)
                .map(unitTranslation => originalLabel + ' (' + unitTranslation + ')');
            })
        }
        return Observable.of(originalLabel);
      })
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onAfterInsert((response => {
        this.newDietFood = response.item;
        this.close();
      }))
      .build();
  }

  private onStatusChanged(valid: boolean): void {
    this.formIsValid = valid;
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}