import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Location } from '../../../models';
import { LocationsEditMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-location-page.component.html'
})
export class EditLocationPageComponent extends BasePageComponent implements OnInit {

    public locationId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(
            this.activatedRoute.params.map(params => {
                this.locationId = +params['id'];
            })
        );
    }

    handleLoadLocation(location: Location): void {
        this.setConfig({
            menuItems: new LocationsEditMenuItems(location.id).menuItems,
            menuTitle: {
                key: location.locationName
            },
            componentTitle: {
                'key': 'module.locations.submenu.edit'
            }
        });
    }
}
