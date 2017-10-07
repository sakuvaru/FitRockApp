// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

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

    setup(): ComponentSetup | null {
        return {
            initialized: true
        }
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
        this.formConfig = this.dependencies.itemServices.progressItemTypeService.insertForm()
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'TranslateValue'){
                    return false;
                }
                return value;
            })
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('progress-item-types/edit'), response.item.id]))
            .build()
    }
}