import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { stringHelper } from '../../../lib/utilities';
import { AdminMenu, ComponentAction, ComponentDependencyService, MenuItem } from '../../core';
import { BaseLayoutComponent } from './base-layout.component';

export class BaseAdminLayoutComponent extends BaseLayoutComponent implements OnDestroy, AfterViewInit {

    // Setup properties
    public readonly titleCharsLength: number = 22;
    public readonly year: number = new Date().getFullYear();

    // Component configuration & data
    public enableComponentSearch: boolean = false;
    public componentTitle?: string;
    public menuTitle?: string;
    public menuAvatarUrl?: string;
    public actions?: ComponentAction[];

    public displayUsername?: string;
    public email?: string;

    // admin menu
    public adminMenu: AdminMenu = new AdminMenu();

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
    * Part of url identifying 'client' or 'trainer' app type
    */
    public urlSegment?: string;

    /**
     * Menu items
     */
    public menuItems?: MenuItem[];

    constructor(
        protected dependencies: ComponentDependencyService,
        protected cdr: ChangeDetectorRef,
        protected location: Location,
        protected ngZone: NgZone
    ) {
        super(dependencies, ngZone);


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
                this.loaderEnabled = status;
                // at this moment it is required to detect changes here because if (most probably) loader
                // is changed multiple times on the same page (e.g. calling startLoader, stopLoader within the same 
                // method multiple times) this would thrown an error
                this.cdr.detectChanges(); 
            });

        this.dependencies.coreServices.sharedService.componentConfigChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            componentConfig => {
                // set component search
                this.enableComponentSearch = componentConfig.enableSearch ? componentConfig.enableSearch : false;

                // set menu items
                this.menuItems = componentConfig.menuItems;

                // set actions
                this.actions = componentConfig.actions;

                // set component avatar
                if (componentConfig.menuAvatarUrl) {
                    this.menuAvatarUrl = componentConfig.menuAvatarUrl;
                } else {
                    // clear avatar if its not set
                    this.menuAvatarUrl = '';
                }

                // resolve component's title using translation services
                if (componentConfig.componentTitle) {
                    this.dependencies.coreServices.localizationService.get(componentConfig.componentTitle.key, componentConfig.componentTitle.data)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => {
                            this.componentTitle = text;
                        });
                }

                // resolve menu title using translation services
                if (componentConfig.menuTitle) {
                    this.dependencies.coreServices.localizationService.get(componentConfig.menuTitle.key, componentConfig.menuTitle.data)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => {
                            this.menuTitle = text;
                        });
                }

                this.cdr.detectChanges(); 
            });
    }

    handleComponentSearch(search: string): void {
        this.dependencies.coreServices.sharedService.setComponentSearch(search);
    }

    goBack(): void {
        this.location.back();
    }

    shortenTitle(text: string): string | null {
        return stringHelper.shorten(text, this.titleCharsLength, true);
    }
}
