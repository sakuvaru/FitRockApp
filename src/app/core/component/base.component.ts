import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AppConfig } from '../config/app.config';
import { UrlConfig } from '../config/url.config';
import { ComponentDependencyService } from './component-dependency.service';
import { ErrorResponse, ErrorReasonEnum } from '../../../lib/repository';
import { ComponentConfig, IComponentConfig, ResourceKey, MenuItem } from './component.config';
import { Observable, Subject } from 'rxjs/Rx';
import { NavigationExtras } from '@angular/router'

@Component({
})
export abstract class BaseComponent implements OnInit, OnDestroy {

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

    // component config
    protected componentConfig: IComponentConfig = new ComponentConfig();

    // snackbar config
    private snackbarDefaultDuration = 2500;

    // translations
    private snackbarSavedText: string;

    constructor(protected dependencies: ComponentDependencyService) {
        // stop loaders on component init 
        this.dependencies.coreServices.sharedService.setComponentLoader(false);
        this.dependencies.coreServices.sharedService.setTopLoader(false);

        // authenticate user when logging-in (handles the params in URL and extracts token
        // more info: https://auth0.com/docs/quickstart/spa/angular2/02-custom-login
        if (!this.dependencies.coreServices.authService.isAuthenticated()) {
            this.dependencies.coreServices.authService.handleAuthentication();
        }

        // set language version
        // this language will be used as a fallback when a translation isn't found in the current language
        this.dependencies.coreServices.translateService.setDefaultLang(AppConfig.DefaultLanguage);

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.dependencies.coreServices.translateService.use(this.dependencies.coreServices.translateService.getBrowserLang());

        // translate snackbar
        this.dependencies.coreServices.translateService.get('shared.saved').subscribe(text => this.snackbarSavedText = text);

        // suscribe to errors in repository service and handle them
        this.dependencies.coreServices.repositoryClient.requestErrorChange$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            error => {
                this.handleRepositoryError(error);
            });
    }

    // ----------------------- Lifecycle Events --------------------- // 

    /**
     * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnDestroy' as otherwise
     * this method will not be called
     */
    ngOnInit() {
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

    // ------------------- Loader ---------------------------- //

    startLoader(): void {
        this.dependencies.coreServices.sharedService.setComponentLoader(true);
    }

    stopLoader(): void {
        this.dependencies.coreServices.sharedService.setComponentLoader(false);
    }

    startGlobalLoader(): void {
        this.dependencies.coreServices.sharedService.setTopLoader(true);
    }

    stopGlobalLoader(): void {
        this.dependencies.coreServices.sharedService.setTopLoader(false);
    }

    /**
     * Uses redirect through redirect component to force refresh a component
     * @param url Url to redirect
     */
    forceRefresh(url: string): void {
        var redirectHandlerUrl = this.getAppUrl(UrlConfig.Redirect);
        this.dependencies.router.navigate([redirectHandlerUrl], { queryParams: { 'url': url }, queryParamsHandling: "merge" });
    }

    navigate(commands: any[], extras?: NavigationExtras): void {
        this.dependencies.router.navigate(commands, extras);
    }

    navigateTo404(): void {
        this.dependencies.router.navigate([UrlConfig.getItem404()]);
    }

    // -------------------- Component config ------------------ //

    updateMenuItems(menuItems: MenuItem[]): void {
        this.componentConfig.menuItems = menuItems;
        this.componentConfig.setDefaultValues();
        this.setConfig();
    }

    updateComponentTitle(title: ResourceKey): void {
        this.componentConfig.componentTitle = title;
        this.componentConfig.setDefaultValues();
        this.setConfig();
    }

    setConfig(options?:
        {
            componentTitle?: ResourceKey,
            menuItems?: MenuItem[],
            appName?: string,
            menuTitle?: ResourceKey
        }): void {
        if (options) {
            Object.assign(this.componentConfig, options);
        }
        this.componentConfig.setDefaultValues();
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    // --------------------- Private methods -------------- // 

    private handleRepositoryError(error: ErrorResponse) {
        // handle license error
        if (error.reason == ErrorReasonEnum.LicenseLimitation) {
            console.log("YOU DONT HAVE LICENSE FOR THIS ACTION, TODO");
        }
    }

    // --------------- Snackbar ------------------- //

    showSnackbar(message: string): void {
        let snackBarRef = this.dependencies.mdServices.snackbarService.open(message, null, { duration: this.snackbarDefaultDuration });
    }

    showSavedSnackbar(): void {
        this.showSnackbar(this.snackbarSavedText);
    }

    // --------------- Urls ------------------- //

    getClientUrl(action?: string): string {
        return '/' + UrlConfig.getClientUrl(action);
    }

    getAppUrl(action?: string): string {
        return '/' + UrlConfig.getAppUrl(action);
    }

    getAuthUrl(action?: string): string {
        return '/' + UrlConfig.getAuthUrl(action);
    }

    getTrainerUrl(action?: string): string {
        return '/' + UrlConfig.getTrainerUrl(action);
    }
}