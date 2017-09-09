// common
import { Component, Input, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, AppConfig } from '../core';

// required by component
import { Subscription } from 'rxjs/Rx';
import { StringHelper } from '../../lib/utilities';
import { FormControl } from '@angular/forms';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseComponent implements OnDestroy, OnInit {
    private year: number = new Date().getFullYear();
    private media: TdMediaService;

    private hideComponentWhenLoaderIsEnabled = AppConfig.HideComponentWhenLoaderIsEnabled;
    private componentIsInitialized: boolean;
    private componentIsAutoInitialized: boolean;

    private enableComponentSearch: boolean;
    private componentTitle: string;
    private menuTitle: string;
    private globalLoaderEnabled: boolean;

    private displayUsername: string;
    private email: string;

    /**
     * Part of url identifying 'client' or 'trainer' app type
     */
    private urlSegment: string;

    /**
     * Admin search
     */
    private searchControl = new FormControl();

    private searchDebounceTime: number = 300;

    private componentSearchValue: string = '';

    private readonly titleCharsLength: number = 22;

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
                this.cdr.detectChanges();
            });

        this.dependencies.coreServices.sharedService.componentIsInitializedChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            initialized => {
                this.componentIsInitialized = initialized;
                this.cdr.detectChanges();
            });

        this.dependencies.coreServices.sharedService.componentConfigChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            componentConfig => {
                this.componentConfig = componentConfig;

                this.componentIsAutoInitialized = componentConfig.autoInitComponent;
                this.enableComponentSearch = componentConfig.enableSearch;

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
        return StringHelper.shorten(text, this.titleCharsLength, true)
    }
}
