
// common
import { Component, Input, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, AppConfig } from '../core';

// required by component
import { Subscription } from 'rxjs/Rx';
import { stringHelper } from '../../lib/utilities';
import { FormControl } from '@angular/forms';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseComponent implements OnDestroy, OnInit {
    
    private readonly titleCharsLength: number = 22;
    private readonly year: number = new Date().getFullYear();
    private readonly hideComponentWhenLoaderIsEnabled = AppConfig.HideComponentWhenLoaderIsEnabled;
    
    private media: TdMediaService;

    private componentIsInitialized: boolean;
    private componentIsAutoInitialized: boolean;

    private enableComponentSearch: boolean;
    private componentTitle: string;
    private menuTitle: string;
    private globalLoaderEnabled: boolean;
    private menuAvatarUrl: string;

    private displayUsername: string;
    private email: string;

    /**
     * Part of url identifying 'client' or 'trainer' app type
     */
    private urlSegment: string;

    /**
     * Admin search
     */
    private readonly searchDebounceTime: number = 300;
    private searchControl = new FormControl();
    private componentSearchValue: string = '';

    constructor(
        protected dependencies: ComponentDependencyService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super(dependencies)

        // set alias for media
        this.media = this.dependencies.tdServices.mediaService;
    }

    ngOnInit() {
        super.ngOnInit();

        // init component search if search is enabled
        this.initComponentSearch();

        // init user texts
        var user = this.dependencies.authenticatedUserService.getUser();
        if (user) {
            this.displayUsername = user.firstName + ' ' + user.lastName;
            this.email = user.email;
        }

        // register loaders
        this.dependencies.coreServices.sharedService.topLoaderChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            enabled => {
                this.globalLoaderEnabled = enabled;
                this.changeDetectorRef.detectChanges();
            });

        this.dependencies.coreServices.sharedService.componentIsInitializedChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            initialized => {
                this.componentIsInitialized = initialized;
                console.log(initialized);
                this.changeDetectorRef.detectChanges();
            });

        this.dependencies.coreServices.sharedService.componentConfigChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            componentConfig => {
                this.componentConfig = componentConfig;
                this.componentIsAutoInitialized = componentConfig.autoInitComponent;
                this.enableComponentSearch = componentConfig.enableSearch;


                if (componentConfig.menuAvatarUrl){
                    this.menuAvatarUrl = componentConfig.menuAvatarUrl;
                }
                else{
                    // clear avatar if its not set
                    this.menuAvatarUrl = '';
                }

                // resolve component's title using translation services
                if (componentConfig.componentTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.componentTitle.key, componentConfig.componentTitle.data)
                        .subscribe(text => {
                            this.componentTitle = text;
                            this.changeDetectorRef.detectChanges();
                        });
                }

                // resolve menu title using translation services
                if (componentConfig.menuTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.menuTitle.key, componentConfig.menuTitle.data)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => {
                            this.menuTitle = text;
                            this.changeDetectorRef.detectChanges();
                        });
                }
            });
    }

    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        this.media.broadcast();
        this.changeDetectorRef.detectChanges();
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

    private getMenuItemColor(action: string, type: MenuItemType): string | null {
        var activeColor = 'accent';

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

    private shortenTitle(text: string): string | null {
        return stringHelper.shorten(text, this.titleCharsLength, true)
    }
}
