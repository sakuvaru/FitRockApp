// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { FoodMenuItems } from '../menu.items';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Food } from '../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-food.component.html'
})
export class EditFoodComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.foodService.buildEditForm(+params['id'], (error) => super.handleAppError(error))
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('foods')]))
                    .onEditFormLoaded(form => {
                        this.setConfig({
                            menuItems: new FoodMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.edit'
                            }
                        });
                    })
                    .build();
            })
            .subscribe();
    }
}
