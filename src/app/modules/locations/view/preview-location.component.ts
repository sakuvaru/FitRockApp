import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AppConfig } from '../../../config';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Location } from '../../../models';
import { LocationPreviewMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-location.component.html'
})
export class PreviewLocationComponent extends BasePageComponent implements OnInit {

    public location: Location;

    public googleApiKey: string = AppConfig.GoogleApiKey;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(this.getItemObservable());
    }

    private getItemObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.locationService.item()
                .byId(+params['id'])
                .get()
                .takeUntil(this.ngUnsubscribe))
            .map(response => {
                this.location = response.item;

                if (this.location.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
                    this.setConfig({
                        menuItems: new LocationPreviewMenuItems(this.location.id).menuItems,
                        menuTitle: {
                            key: this.location.locationName
                        },
                        componentTitle: {
                            'key': 'module.locations.submenu.view'
                        }
                    });
                } else {
                    this.setConfig({
                        menuItems: new LocationPreviewMenuItems(response.item.id).menuItems,
                        menuTitle: {
                            key: response.item.locationName
                        },
                        componentTitle: {
                            'key': 'module.locations.submenu.view'
                        }
                    });
                }
            });
    }
}
