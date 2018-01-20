import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';
import { FoodMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-food-page.component.html'
})
export class PreviewFoodPageComponent extends BasePageComponent implements OnInit {

    public foodId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.ngOnInit();
        
        super.subscribeToObservable(
            this.activatedRoute.params.map(params => {
                this.foodId = +params['id'];
            })
        );
    }

    handleLoadFood(food: Food): void {
        if (food.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
            this.setConfig({
                menuItems: new FoodMenuItems(food.id).menuItems,
                menuTitle: {
                    key: food.foodName
                },
                componentTitle: {
                    'key': 'module.foods.submenu.previewFood'
                }
            });
        } else {
            this.setConfig({
                menuItems: new FoodMenuItems(food.id).menuItems,
                menuTitle: {
                    key: food.foodName
                },
                componentTitle: {
                    'key': 'module.foods.submenu.previewFood'
                }
            });
        }
    }
}
