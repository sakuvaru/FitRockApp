// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewFoodMenuItems } from '../menu.items';
import { Food } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-food.component.html'
})
export class NewFoodComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Food>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.foods.submenu.new' },
            menuItems: new NewFoodMenuItems().menuItems
        });

        super.subscribeToObservable(this.getFormObservable());
    }

    private getFormObservable(): Observable<any> {
        return this.dependencies.itemServices.foodService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.foodService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('foods/edit'), response.item.id]));

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}