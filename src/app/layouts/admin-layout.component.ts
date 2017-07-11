// common
import { Component, Input, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { ComponentDependencyService, BaseComponent, MenuItemType } from '../core';

// required by component
import { Subscription } from 'rxjs/Rx';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseComponent implements OnDestroy, OnInit {
    private year: number = new Date().getFullYear();
    private media: TdMediaService;

    private componentTitle: string;
    private menuTitle: string;
    private componentLoaderEnabled: boolean;
    private topLoaderEnabled: boolean;

    private displayUsername: string;
    private email: string;

    /**
     * Part of url identifying 'client' or 'trainer' app type
     */
    private urlSegment: string;

    // subscriptions - unsubscribe 
    private componentLoaderSubscription: Subscription;
    private topLoaderSubscription: Subscription;
    private componentConfigSubscription: Subscription;

    constructor(
        protected dependencies: ComponentDependencyService,
        private cdr: ChangeDetectorRef,
    ) {
        super(dependencies)

        // set alias for media
        this.media = this.dependencies.tdServices.mediaService;
    }

    ngOnInit() {
        super.ngOnInit();

        // init user texts
        this.dependencies.authUser.subscribe(user => {
            this.displayUsername = user.firstName + ' ' + user.lastName;
            this.email = user.email;
        })

        // register loaders
        this.componentLoaderSubscription = this.dependencies.coreServices.sharedService.componentloaderChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            enabled => {
                this.componentLoaderEnabled = enabled;
                this.cdr.detectChanges();
            });

        this.topLoaderSubscription = this.dependencies.coreServices.sharedService.topLoaderChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            enabled => {
                this.topLoaderEnabled = enabled;
                this.cdr.detectChanges();
            });

        this.componentConfigSubscription = this.dependencies.coreServices.sharedService.componentConfigChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
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
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => {
                            this.menuTitle = text;
                        });
                }
            });

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
        super.ngOnDestroy();
        // prevent memory leaks when component is destroyed
        // source: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service

        // in some cases subscription is not yet initialized (e.g. when navigating from constructor), check for null
        if (this.componentConfigSubscription != null) {
            this.componentConfigSubscription.unsubscribe();
        }

        if (this.topLoaderSubscription != null) {
            this.topLoaderSubscription.unsubscribe();
        }

        if (this.componentLoaderSubscription != null) {
            this.componentLoaderSubscription.unsubscribe();
        }
    }

    private getMenuItemUrl(action: string, type: MenuItemType): string {
        var url;

        if (type === MenuItemType.client) {
            url = this.getClientUrl(action);
        }
        else if (type === MenuItemType.trainer) {
            url = this.getTrainerUrl(action);
        }
        else if (type === MenuItemType.auth) {
            url = this.getAuthUrl(action);
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
