// common
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import {
    ComponentDependencyService, BaseComponent,
    IComponentConfig, MenuItemType
} from '../core';

// required by component
import { Subscription } from 'rxjs/RX';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseComponent implements OnDestroy {
    private media: TdMediaService;

    private componentTitle: string;
    private menuTitle: string;

    private componentLoaderEnabled: boolean;
    private topLoaderEnabled: boolean;

    /**
     * Part of url identifying 'client' or 'trainer' app type
     */
    private urlSegment: string;

    // subscriptions - unsubscribe in OnDestroy
    private componentLoaderSubscription: Subscription;
    private topLoaderSubscription: Subscription;
    private componentConfigSubscription: Subscription;

    constructor(
        protected dependencies: ComponentDependencyService,
        private cdr: ChangeDetectorRef,
    ) {
        super(dependencies)

        // !!! --- don't forget to unsubscribe to subscriptions --- !!!

        // register loaders
        this.componentLoaderSubscription = this.dependencies.coreServices.sharedService.componentloaderChanged$.subscribe(
            enabled => {
                this.componentLoaderEnabled = enabled;
                this.cdr.detectChanges();
            }
        )
        this.topLoaderSubscription = this.dependencies.coreServices.sharedService.topLoaderChanged$.subscribe(
            enabled => {
                this.topLoaderEnabled = enabled;
                this.cdr.detectChanges();
            }
        )

        this.componentConfigSubscription = dependencies.coreServices.sharedService.componentConfigChanged$.subscribe(
            componentConfig => {
                this.componentConfig = componentConfig;

                // resolve component's title using translation services
                if (componentConfig.componentTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.componentTitle.key, componentConfig.componentTitle.data)
                        .subscribe(text => {
                            this.componentTitle = text;
                        });
                }

                // resolve menu title using translation services
                if (componentConfig.menuTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.menuTitle.key, componentConfig.menuTitle.data)
                        .subscribe(text => {
                            this.menuTitle = text;
                        });
                }
            });

        // set alias for media
        this.media = dependencies.tdServices.mediaService;
    }

    ngAfterViewInit(): void {
        this.media.broadcast();
        // broadcast to all listener observables when loading the page
        // note required by 'Covalent' for its templates
        // source: https://teradata.github.io/covalent/#/layouts/manage-list
        // + broadcast change detection issue, see - https://github.com/Teradata/covalent/issues/425
        // + fixed with ChangeDetectorRef => https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
        // mentioned in official doc now -> https://teradata.github.io/covalent/#/layouts/manage-list
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        // prevent memory leaks when component is destroyed
        // source: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
        this.componentConfigSubscription.unsubscribe();

        this.topLoaderSubscription.unsubscribe();
        this.componentLoaderSubscription.unsubscribe();
    }

    private getMenuItemUrl(action: string, type: MenuItemType): string {
        var url;

        if (type === MenuItemType.client) {
            url = this.getClientUrl(action);
        }
        else if (type === MenuItemType.trainer) {
            url = this.getTrainerUrl(action);
        }
        else if (type === MenuItemType.public) {
            url = this.getPublicUrl(action);
        }
        else {
            throw Error(`Cannot get menu item url of '${type}' type`);
        }

        return url;
    }

    private getMenuItemColor(action: string, type: MenuItemType): string {
        var activeColor = 'primary';

        var url = this.getMenuItemUrl(action, type);
        var currentUrl = this.dependencies.router.url;

        if (currentUrl === url) {
            return activeColor;
        }

        if (currentUrl.startsWith(url) && currentUrl.endsWith(url)) {
            return activeColor;
        }

        return null;
    }
}