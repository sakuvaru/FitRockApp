import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { IComponent } from './icomponent.interface';
import { AppConfig } from '../config/app.config';
import { UrlConfig } from '../config/url.config';
import { ComponentDependencyService } from './component-dependency.service';
import { ErrorResponse, ErrorReasonEnum } from '../../../lib/repository';
import { ComponentConfig, IComponentConfig, ResourceKey, MenuItem } from './component.config';
import { Observable, Subscription, Subject } from 'rxjs/Rx';
import { NavigationExtras } from '@angular/router'

@Component({
})
export abstract class BaseComponent implements IComponent, OnInit {

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

    // subscriptions
    private repositoryErrorSubscription: Subscription;

    constructor(protected dependencies: ComponentDependencyService) {
    }

    // ----------------------- Events --------------------- // 

    ngOnInit(): void {
        // authenticate user when logging-in (handles the params in URL and extracts token
        // more info: https://auth0.com/docs/quickstart/spa/angular2/02-custom-login
        if (!this.dependencies.coreServices.authService.isAuthenticated()) {
            this.dependencies.coreServices.authService.handleAuthentication();
        }

        // init component config
        this.setConfig();

        // set language version
        // this language will be used as a fallback when a translation isn't found in the current language
        this.dependencies.coreServices.translateService.setDefaultLang(AppConfig.DefaultLanguage);

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.dependencies.coreServices.translateService.use(this.dependencies.coreServices.translateService.getBrowserLang());

        // suscribe to errors in repository service and handle them
        this.repositoryErrorSubscription = this.dependencies.coreServices.repositoryClient.requestErrorChange$.subscribe(
            error => {
                this.handleRepositoryError(error);
            });

        // stop loaders on component init 
        this.dependencies.coreServices.sharedService.setComponentLoader(false);
        this.dependencies.coreServices.sharedService.setTopLoader(false);
    }

    ngOnDestroy() {
        // ng unsubscribe as per recommendation
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
        var redirectHandlerUrl = this.getPublicUrl(UrlConfig.Redirect);
        this.dependencies.router.navigate([redirectHandlerUrl], { queryParams: { 'url': url }, queryParamsHandling: "merge" });
    }

    navigate(commands: any[], extras?: NavigationExtras): void {
        this.dependencies.router.navigate(commands, extras);
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
        }
    ): void {
        if (options) {
            Object.assign(this.componentConfig, options);
        }
        this.componentConfig.setDefaultValues();
        this.setConfigInternal();
    }

    private setConfigInternal(): void {
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    // --------------------- Private methods -------------- // 

    private handleRepositoryError(error: ErrorResponse) {
        // stop all loaders
        this.stopGlobalLoader();
        this.stopLoader();

        // don't handle form errors, but do handle other errors
        if (error.reason == ErrorReasonEnum.LicenseLimitation) {
            console.log("YOU DONT HAVE LICENSE FOR THIS ACTION, TODO");
        }
    }

    // --------------- Public methods ------------------- //

    showErrorPage(errorResponse: ErrorResponse) {
        // redirect to error page
        this.dependencies.router.navigate([UrlConfig.getPublicUrl(UrlConfig.Error)], { queryParams: { result: errorResponse.error } });
    }

    showSnackbar(message: string): void {
        let snackBarRef = this.dependencies.mdServices.snackbarService.open(message, null, { duration: this.snackbarDefaultDuration });
    }

    showSavedSnackbar(): void {
        this.showSnackbar("Uloženo");
    }

    redirectToErrorPage(): void {
        this.dependencies.router.navigate([UrlConfig.getPublicUrl(UrlConfig.Error)]);
    }

    getClientUrl(action?: string): string {
        return '/' + UrlConfig.getClientUrl(action);
    }

    getPublicUrl(action?: string): string {
        return '/' + UrlConfig.getPublicUrl(action);
    }

    getTrainerUrl(action?: string): string {
        return '/' + UrlConfig.getTrainerUrl(action);
    }
}