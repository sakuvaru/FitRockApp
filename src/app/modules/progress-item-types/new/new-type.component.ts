// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataFormConfig } from '../../../../web-components/data-form';
import { NewProgressItemTypeMenuItems } from '../menu.items';
import { ProgressItemType } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-type.component.html'
})
export class NewTypeComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.progressItemTypes.submenu.new' },
            menuItems: new NewProgressItemTypeMenuItems().menuItems,
            menuTitle: { key: 'module.progressItemTypes.submenu.overview' }
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.buildInsertForm()
            .configField((field, item) => {
                if (field.key === 'TranslateValue') {
                    field.value = false;
                }
                return Observable.of(field);
            })
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('progress-item-types/edit'), response.item.id]))
            .build();
    }
}
