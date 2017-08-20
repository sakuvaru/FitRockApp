// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewProgressItemTypeMenuItems } from '../menu.items';
import { ProgressItemType } from '../../../models';

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
        this.initForm();
    }

    private initForm(): void{
        this.startLoader();

        this.setConfig({
            componentTitle: { key: 'module.progressItemTypes.submenu.new' },
            menuItems: new NewProgressItemTypeMenuItems().menuItems,
            menuTitle: { key: 'module.progressItemTypes.submenu.overview'}
        });

        this.dependencies.itemServices.progressItemTypeService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(form => {
                form.onFormInit(() => this.stopLoader())
                form.onBeforeSave(() => this.startGlobalLoader());
                form.onAfterSave(() => this.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.progressItemTypeService.create(item).set());
                form.onAfterInsert((response) => this.navigate([this.getTrainerUrl('progress-item-types/edit'), response.item.id]));
                form.onError(() => {
                    super.stopGlobalLoader();
                });

                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}