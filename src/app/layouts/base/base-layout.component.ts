
// common
import { Component, Input, OnDestroy, ChangeDetectorRef, } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { Subject } from 'rxjs/Rx';
import { AppConfig, UrlConfig } from '../../config';
import { stringHelper } from '../../../lib/utilities';
import { GlobalLoaderStatus, ComponentDependencyService, MenuItemType  } from '../../core';

@Component({
})
export class BaseLayoutComponent implements OnDestroy {

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

    protected appName: string = AppConfig.AppName;

    constructor(
        protected dependencies: ComponentDependencyService,
    ) {
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

    protected getMenuItemUrl(action: string, type: MenuItemType): string {
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

    protected getAuthUrl(action: string): string {
        return '/' + UrlConfig.getAuthUrl(action);
    }

    protected getHomeUrl(): string {
        const authUser = this.dependencies.authenticatedUserService.getUser();
        if (authUser) {
            if (authUser.isClient) {
                return '/' + UrlConfig.getClientUrl('');
            } else {
                return '/' + UrlConfig.getTrainerUrl('');
            }
        }

        console.warn('User is not authenticated');
        return '';
    }

    protected getMenuItemColor(action: string, type: MenuItemType): string | null {
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
}
