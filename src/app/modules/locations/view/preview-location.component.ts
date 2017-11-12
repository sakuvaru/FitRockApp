// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { LocationPreviewMenuItems } from '../menu.items';
import { Location } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'preview-location.component.html'
})
export class PreviewLocationComponent extends BaseComponent implements OnInit {

    private location: Location;

    private googleApiKey: string = AppConfig.GoogleApiKey;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
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
                            'key': 'module.foods.submenu.preview'
                        }
                    });
                } else {
                    this.setConfig({
                        menuItems: new LocationPreviewMenuItems(response.item.id).menuItems,
                        menuTitle: {
                            key: response.item.locationName
                        },
                        componentTitle: {
                            'key': 'module.foods.submenu.preview'
                        }
                    });
                }
            });
    }
}
