import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food } from 'app/models';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { MealMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-meal-page.component.html'
})
export class EditMealPageComponent extends BasePageComponent implements OnInit {

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
        this.setConfig({
            menuItems: new MealMenuItems(food.id).menuItems,
            menuTitle: {
                key: food.foodName
            },
            componentTitle: {
                'key': 'module.foods.submenu.editMeal'
            }
        });
    }
}
