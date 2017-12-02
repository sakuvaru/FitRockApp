// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataFormConfig } from '../../../../web-components/data-form';
import { NewLocationsMenuItems } from '../menu.items';
import { Location } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-location.component.html'
})
export class NewLocationComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            menuTitle: { key: 'module.locations.submenu.overview' },
            componentTitle: { key: 'module.locations.submenu.new' },
            menuItems: new NewLocationsMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.locationService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('locations/edit'), response.item.id]))
            .optionLabelResolver((field, optionLabel) => {
                if (field.key === 'LocationType') {
                    return super.translate('module.locations.type.' + optionLabel);
                }
                return Observable.of(optionLabel);
            })
            .build();
    }
}
