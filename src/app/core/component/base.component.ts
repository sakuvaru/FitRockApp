import { OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';

import { UrlConfig } from '../../config';
import { ComponentDependencyService } from './component-dependency.service';
import { AuthenticatedUser, LanguageConfig } from 'app/core';


export abstract class BaseComponent implements OnInit, OnDestroy {

    /**
     * Important - used to unsubsribe ALL subscriptions when component is destroyed. This ensures that requests are cancelled
     * when navigating away from the component. 
     * Solution should be official - taken from https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
     * Usage: use 'takeUntil(this.ngUnsubscribe)' for all subscriptions.
     * Example: this.myThingService.getThings()
     *       .takeUntil(this.ngUnsubscribe)
      *      .subscribe(things => console.log(things));
     */
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    /**
    * Current language
    */
    protected currentLanguage?: LanguageConfig;

    /**
     * Current user
     */
    protected authUser?: AuthenticatedUser;

    constructor(protected dependencies: ComponentDependencyService) {
    }

    // ----------------------- Lifecycle Events --------------------- // 

    /**
     * If a child component implements its own ngOnInit, it needs to call 'super.ngOnInit' as otherwise
     * this method will not be called.
     */
    ngOnInit(): void {
        // init current language
        this.currentLanguage = this.dependencies.coreServices.currentLanguageService.getLanguage();

        // init auth user
        this.authUser = this.dependencies.authenticatedUserService.getUser();

        // stop loaders on component init 
        this.dependencies.coreServices.sharedService.setGlobalLoader(false, false);
    }

    /**
     * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnDestroy' as otherwise
     * this method will not be called.
     */
    ngOnDestroy(): void {
        // ng unsubscribe as per recommendation
        // see comments on top
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    // ------------------- Loader ---------------------------- //

    startGlobalLoader(): void {
        this.dependencies.coreServices.sharedService.setGlobalLoader(true, false);
    }

    stopGlobalLoader(forceDisable: boolean = false): void {
        this.dependencies.coreServices.sharedService.setGlobalLoader(false, forceDisable);
    }

    stopAllLoaders(forceDisable: boolean = false): void {
        this.stopGlobalLoader(forceDisable);
    }

    /**
     * Uses redirect through redirect component to force refresh a component
     * @param url Url to redirect
     */
    forceRefresh(url: string): void {
        const redirectHandlerUrl = this.getAppUrl(UrlConfig.Redirect);
        this.dependencies.coreServices.navigateService.navigate(
            [redirectHandlerUrl],
            {
                queryParams: {
                    'url': url
                },
                queryParamsHandling: 'merge'
            });
    }

    navigate(commands: any[], extras?: NavigationExtras): void {
        this.dependencies.coreServices.navigateService.navigate(commands, extras);
    }

    getClientUrl(action?: string): string {
        return '/' + UrlConfig.getClientUrl(action);
    }

    getAppUrl(action: string): string {
        return '/' + UrlConfig.getActionUrl(action);
    }

    getAuthUrl(action?: string): string {
        return '/' + UrlConfig.getAuthUrl(action);
    }

    getTrainerUrl(action?: string): string {
        return '/' + UrlConfig.getTrainerUrl(action);
    }

    translate(key: string, data?: any): Observable<string> {
        return this.dependencies.coreServices.localizationService.get(key, data);
    }

    formatDate(date: Date): string {
        return this.dependencies.coreServices.timeService.formatDate(date);
    }

    fromNow(date: Date): string {
        return this.dependencies.coreServices.timeService.fromNow(date);
    }
}
