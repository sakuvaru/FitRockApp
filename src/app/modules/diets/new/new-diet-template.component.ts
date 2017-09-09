// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewDietMenuItems } from '../menu.items';
import { Diet } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-diet-template.component.html'
})
export class NewDietTemplateComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Diet>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.diets.submenu.new' },
            menuItems: new NewDietMenuItems().menuItems
        });

        super.subscribeToObservable(this.getFormObservable());
    }

    private getFormObservable(): Observable<any> {
        return this.dependencies.itemServices.dietService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                form.insertFunction((item) => this.dependencies.itemServices.dietService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('diets/edit-plan'), response.item.id]));

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}