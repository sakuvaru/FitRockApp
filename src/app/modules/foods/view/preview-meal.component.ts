import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Food } from '../../../models';
import { MealMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-meal.component.html'
})
export class PreviewMealComponent extends BaseComponent implements OnInit {

    public food: Food;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(this.getItemObservable());
    }

    private getItemObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.foodService.item()
                .byId(+params['id'])
                .get())
            .map(response => {
                this.food = response.item;

                if (this.food.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
                    this.setConfig({
                        menuItems: new MealMenuItems(this.food.id).menuItems,
                        menuTitle: {
                            key: this.food.foodName
                        },
                        componentTitle: {
                            'key': 'module.foods.submenu.previewMeal'
                        }
                    });
                } else {
                    this.setConfig({
                        menuItems: new MealMenuItems(response.item.id).menuItems,
                        menuTitle: {
                            key: response.item.foodName
                        },
                        componentTitle: {
                            'key': 'module.foods.submenu.previewMeal'
                        }
                    });
                }
            });
    }
}
