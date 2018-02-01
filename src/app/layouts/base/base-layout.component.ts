import { OnDestroy, NgZone, AfterViewInit, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Rx';

import { AppConfig, UrlConfig } from '../../config';
import { ComponentDependencyService, MenuItemType } from '../../core';
import { TdMediaService } from '@covalent/core';

export class BaseLayoutComponent implements OnDestroy, AfterViewInit, OnInit {

    public isMobile: boolean = false;

    // shortcut to media service
    public mediaService?: TdMediaService;

    /**
    * Important - used to unsubsribe ALL subscriptions when component is destroyed. This ensures that requests are cancelled
    * when navigating away from the component.
    * Solution should be official - taken from https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
    * Usage: use 'takeUntl(this.ngUnsubscribe)' for all subscriptions.
    * Example: this.myThingService.getThings()
    *       .takeUntil(this.ngUnsubscribe)
    *      .subscribe(things => console.log(things));
    */
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    public appName: string = AppConfig.AppName;

    constructor(
        protected dependencies: ComponentDependencyService,
        protected ngZone: NgZone
    ) {
        this.mediaService = dependencies.tdServices.mediaService;
    }

    ngOnInit(): void {
        this.watchScreen();
    }

    /**
    * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnDestroy' as otherwise
    * this method will not be called
    */
    ngOnDestroy() {
        // ng unsubscribe as per recommendation
        // see comments on top
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        if (!this.mediaService) {
            throw Error(`Media service was not initialized`);
        }
        this.mediaService.broadcast();
    }

    getMenuItemUrl(action: string, type: MenuItemType): string {
        let url;

        if (type === MenuItemType.client) {
            url = '/' + UrlConfig.getClientUrl(action);
        } else if (type === MenuItemType.trainer) {
            url = '/' + UrlConfig.getTrainerUrl(action);
        } else if (type === MenuItemType.auth) {
            url = '/' + UrlConfig.getAuthUrl(action);
        } else {
            throw Error(`Cannot get menu item url of '${type}' type`);
        }

        return url;
    }

    getAuthUrl(action: string): string {
        return '/' + UrlConfig.getAuthUrl(action);
    }

    getDashboardUrl(): string {
        const authUser = this.dependencies.authenticatedUserService.getUser();
        if (authUser) {
            if (authUser.isClient) {
                return this.dependencies.coreServices.navigateService.clientDashboardPage().getUrl();
            } else {
                return this.dependencies.coreServices.navigateService.trainerDashboardPage().getUrl();
            }
        }

        console.warn('User is not authenticated');
        return '';
    }

    menuItemIsActive(action: string, type: MenuItemType, exactMatch: boolean = true): boolean {
        const url = this.getMenuItemUrl(action, type);
        const currentUrl = this.dependencies.coreServices.navigateService.getCurrentUrl();

        if (exactMatch) {
            return currentUrl.toLowerCase() === url.toLowerCase();
        }

        return currentUrl.startsWith(url);
    }

    fromNow(date: Date): string {
        return this.dependencies.coreServices.timeService.fromNow(date);
    }

    private watchScreen(): void {
        if (!this.mediaService) {
            throw Error(`Media service was not initialized`);
        }

        this.mediaService.registerQuery('xs')
            .takeUntil(this.ngUnsubscribe)
            .subscribe((matches: boolean) => {
                this.ngZone.run(() => {
                    this.isMobile = matches;
                });
            });
    }

}
