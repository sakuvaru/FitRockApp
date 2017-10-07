
// common
import { Component, Input, OnDestroy, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, AppConfig, ComponentSetup } from '../core';

// required by component
import { Subscription } from 'rxjs/Rx';
import { stringHelper } from '../../lib/utilities';
import { GlobalLoaderStatus } from '../core';
import { FormControl } from '@angular/forms';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseComponent implements OnDestroy, OnInit, AfterViewInit {

    // Setup properties
    private readonly titleCharsLength: number = 22;
    private readonly year: number = new Date().getFullYear();
    private readonly hideComponentWhenLoaderIsEnabled = AppConfig.HideComponentWhenLoaderIsEnabled;

    // Services
    private media: TdMediaService;

    // Component configuration & data
    private globalLoaderStatus: GlobalLoaderStatus = new GlobalLoaderStatus(false, false);
    private componentIsInitialized: boolean;
    private enableComponentSearch: boolean;
    private componentTitle: string;
    private menuTitle: string;
    private menuAvatarUrl: string;

    // calculated data
    private displayUsername: string;
    private email: string;

    /**
     * This property indicates if component should be shown
     */
    private showComponent: boolean = false;

    /**
     * Indicates if loader should be shown
     */
    private showLoading: boolean = false;

    /**
     * Part of url identifying 'client' or 'trainer' app type
     */
    private urlSegment: string;

    // Admin search
    private readonly searchDebounceTime: number = 300;
    private readonly searchControl = new FormControl();
    private componentSearchValue: string = '';

    constructor(
        protected dependencies: ComponentDependencyService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super(dependencies);

        // set alias for media
        this.media = this.dependencies.tdServices.mediaService;
    }

    setup(): ComponentSetup | null {
        return null;
      }

    ngOnInit() {
        super.ngOnInit();

        // init component search if search is enabled
        this.initComponentSearch();

        // init user texts
        const user = this.dependencies.authenticatedUserService.getUser();
        if (user) {
            this.displayUsername = user.firstName + ' ' + user.lastName;
            this.email = user.email;
        }

        // register subscriptions
        this.dependencies.coreServices.sharedService.globalLoaderChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            status => {
                this.globalLoaderStatus = status;
                this.componentChangedNotification();
            });

        this.dependencies.coreServices.sharedService.componentSetupChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            setup => {
                this.componentIsInitialized = setup.initialized;
                this.componentChangedNotification();
            });

        this.dependencies.coreServices.sharedService.componentConfigChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            componentConfig => {
                this.componentConfig = componentConfig;
                this.enableComponentSearch = componentConfig.enableSearch;

                if (componentConfig.menuAvatarUrl) {
                    this.menuAvatarUrl = componentConfig.menuAvatarUrl;
                } else {
                    // clear avatar if its not set
                    this.menuAvatarUrl = '';
                }

                // resolve component's title using translation services
                if (componentConfig.componentTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.componentTitle.key, componentConfig.componentTitle.data)
                        .subscribe(text => {
                            this.componentTitle = text;
                            this.componentChangedNotification();
                        });
                }

                // resolve menu title using translation services
                if (componentConfig.menuTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.menuTitle.key, componentConfig.menuTitle.data)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => {
                            this.menuTitle = text;
                            this.componentChangedNotification();
                        });
                }
            });
    }

    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        this.media.broadcast();
        this.componentChangedNotification();
    }

    /**
     * This method has to be called each time any property changes
     */
    private componentChangedNotification(): void {
        this.calculateShowComponent();
        this.calculateShowLoader();
        this.changeDetectorRef.detectChanges();
    }

    private calculateShowLoader(): void {
        this.showLoading = !this.globalLoaderStatus.forceDisable && ((this.hideComponentWhenLoaderIsEnabled && this.globalLoaderStatus.show) || (!this.componentIsInitialized));
    }

    private calculateShowComponent(): void {
        this.showComponent = this.componentIsInitialized;
    }

    private initComponentSearch(): void {
        this.searchControl.valueChanges
            .debounceTime(this.searchDebounceTime)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(search => {
                this.dependencies.coreServices.sharedService.setComponentSearch(search);
            });
    }

    private handleComponentSearch(search: string): void {
        this.dependencies.coreServices.sharedService.setComponentSearch(search);
    }

    private getMenuItemUrl(action: string, type: MenuItemType): string {
        let url;

        if (type === MenuItemType.client) {
            url = this.getClientUrl(action);
        } else if (type === MenuItemType.trainer) {
            url = this.getTrainerUrl(action);
        } else if (type === MenuItemType.auth) {
            url = this.getAuthUrl(action);
        } else {
            throw Error(`Cannot get menu item url of '${type}' type`);
        }

        return url;
    }

    private getMenuItemColor(action: string, type: MenuItemType): string | null {
        const activeColor = 'accent';

        const url = this.getMenuItemUrl(action, type);
        const currentUrl = this.dependencies.router.url;

        if (currentUrl === url) {
            return activeColor;
        }

        if (currentUrl.startsWith(url) && currentUrl.endsWith(url)) {
            return activeColor;
        }

        return null;
    }

    private shortenTitle(text: string): string | null {
        return stringHelper.shorten(text, this.titleCharsLength, true);
    }
}
