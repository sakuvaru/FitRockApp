// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewLocationsMenuItems } from '../menu.items';
import { Location } from '../../../models';

@Component({
    templateUrl: 'new-location.component.html'
})
export class NewLocationComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Location>;

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
        this.formConfig = this.dependencies.itemServices.locationService.insertForm()
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('locations/edit'), response.item.id]))
            .build();
    }
}
