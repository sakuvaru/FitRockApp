// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FoodMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Food } from '../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-food.component.html'
})
export class EditFoodCompoent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Food>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.foodService.editForm(+params['id'])
                    .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('foods')]))
                    .onFormLoaded(form => {
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
    }
}