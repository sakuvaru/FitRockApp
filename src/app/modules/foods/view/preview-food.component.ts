// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FoodPreviewMenuItems, FoodMenuItems } from '../menu.items';
import { Food } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'preview-food.component.html'
})
export class PreviewFoodComponent extends BaseComponent implements OnInit {

    private food: Food;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initItem();
    }

    private initItem(): void {
        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.foodService.item()
                .byId(+params['id'])
                .get()
                .takeUntil(this.ngUnsubscribe))
            .subscribe(response => {
                this.food = response.item;

                if (this.food.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
                    this.setConfig({
                        menuItems: new FoodMenuItems(this.food.id).menuItems,
                        menuTitle: {
                            key: this.food.foodName
                        },
                        componentTitle: {
                            'key': 'module.foods.submenu.preview'
                        }
                    });
                }
                else {
                    this.setConfig({
                        menuItems: new FoodMenuItems(response.item.id).menuItems,
                        menuTitle: {
                            key: response.item.foodName
                        },
                        componentTitle: {
                            'key': 'module.foods.submenu.preview'
                        }
                    });
                }
                super.stopLoader();
            })
    }
}