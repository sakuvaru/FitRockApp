import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Location } from '../../../models';
import { LocationPreviewMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-location-page.component.html'
})
export class PreviewLocationPageComponent extends BasePageComponent implements OnInit {

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
        if (location.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
            this.setConfig({
                menuItems: new LocationPreviewMenuItems(location.id).menuItems,
                menuTitle: {
                    key: location.locationName
                },
                componentTitle: {
                    'key': 'module.locations.submenu.view'
                }
            });
        } else {
            this.setConfig({
                menuItems: new LocationPreviewMenuItems(location.id).menuItems,
                menuTitle: {
                    key: location.locationName
                },
                componentTitle: {
                    'key': 'module.locations.submenu.view'
                }
            });
        }
    }
}
