// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Food, DietFood } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig} from '../../../../web-components/data-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-diet-food-dialog.component.html'
})
export class EditDietFoodDialogComponent extends BaseComponent implements OnInit {

  public dietFoodForm: DataFormConfig;

  // public because it is accessed by parent component
  public dietFood: DietFood;

  public idOfDeletedDietFood: number;
  public dietFoodWasDeleted: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    

    this.dietFood = data;
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
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.buildEditForm(this.dietFood.id)
      .wrapInCard(false)
      .fieldLabelResolver((field, originalLabel) => {
        if (field.key === 'UnitValue') {
          return this.dependencies.itemServices.foodUnitService.item().byId(this.dietFood.food.foodUnitId)
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
      .onAfterEdit((response) => {
        this.dietFood = response.item;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedDietFood = response.deletedItemId;
        this.dietFoodWasDeleted = true;
        this.close();
      })
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
