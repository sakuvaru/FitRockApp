// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewProgressItemTypeMenuItems } from '../menu.items';
import { ProgressItemType } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-type.component.html'
})
export class NewTypeComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItemType>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.progressItemTypes.submenu.new' },
            menuItems: new NewProgressItemTypeMenuItems().menuItems,
            menuTitle: { key: 'module.progressItemTypes.submenu.overview'}
        });

        super.subscribeToObservable(this.getFormObservable());
        }

    private getFormObservable(): Observable<any> {
        return this.dependencies.itemServices.progressItemTypeService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                form.insertFunction((item) => this.dependencies.itemServices.progressItemTypeService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('progress-item-types/edit'), response.item.id]));

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}