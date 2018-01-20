import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Food } from 'app/models';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Observable';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-edit-food',
    templateUrl: 'edit-food.component.html'
})
export class EditFoodComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() foodId: number;

    @Output() loadFood = new EventEmitter<Food>();

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.foodId) {
            this.initForm();
        }
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.foodService.buildEditForm(this.foodId)
            .onAfterDelete(() => super.navigate([this.getTrainerUrl('foods')]))
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'FoodCategoryId') {
                    return super.translate('module.foodCategories.categories.' + originalLabel);
                } else if (field.key === 'FoodUnitId') {
                    return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
                }

                return Observable.of(originalLabel);
            })
            .ignoreFields([
                'AssignedFoodsVirtual'
            ])
            .onEditFormLoaded(form => {
                this.loadFood.next(form.item);
            })
            .build();
    }
}
