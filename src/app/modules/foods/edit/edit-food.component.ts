// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FoodMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Food } from '../../../models';
import 'rxjs/add/operator/switchMap';

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

    private initForm(){
        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => {
                return this.dependencies.itemServices.foodService.editForm(+params['id'])
                    .takeUntil(this.ngUnsubscribe);
            })
            .subscribe(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
                form.onAfterDelete(() => super.navigate([this.getTrainerUrl('foods')]));
                var item = form.getItem();

                this.setConfig({
                    menuItems: new FoodMenuItems(item.id).menuItems,
                    menuTitle: {
                        key: item.foodName
                    },
                    componentTitle: {
                        'key': 'module.foods.submenu.edit'
                    }
                });

                // get form
                this.formConfig = form.build();
            }
            ,
            error => super.handleError(error));
    }
}