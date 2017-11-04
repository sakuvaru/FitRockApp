// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewFoodMenuItems } from '../menu.items';
import { Food } from '../../../models';

@Component({
    templateUrl: 'new-food.component.html'
})
export class NewFoodComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Food>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.foods.submenu.new' },
            menuItems: new NewFoodMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.foodService.insertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('foods/edit'), response.item.id]))
            .build();
    }
}
