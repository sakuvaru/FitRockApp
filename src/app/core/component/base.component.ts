import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { IComponent } from './icomponent.interface';
import { AppConfig } from '../config/app.config';
import { UrlConfig } from '../config/url.config';
import { ComponentDependencyService } from './component-dependency.service';
import { ErrorResponse, ErrorReasonEnum } from '../../../lib/repository';
import { ComponentConfig, IComponentConfig, ResourceKey, MenuItem } from './component.config';
import { Observable, Subscription, Subject } from 'rxjs/RX';

@Component({
})
export abstract class BaseComponent implements IComponent, OnInit {

    // component config
    protected componentConfig: IComponentConfig = new ComponentConfig();

    // name of the full screen loader - can be anything
    private fullscreenLoaderName = "fullscreen-loader";

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

        // initialize loading
        this.dependencies.tdServices.loadingService.create({
            name: this.fullscreenLoaderName,
            mode: LoadingMode.Indeterminate,
            type: LoadingType.Linear,
            color: 'primary',
        });

        // stop all full screen loaders on init (if there are any)
        this.resolveFullScreenLoader();

        // suscribe to errors in repository service and handle them
        this.repositoryErrorSubscription = this.dependencies.coreServices.repositoryClient.requestErrorChange$.subscribe(
            error => {
                this.handleRepositoryError(error);
            });

        // stop loader on component init if its still loading
         this.dependencies.coreServices.sharedService.setLoader(false);
    }

    startLoader(): void {
        this.dependencies.coreServices.sharedService.setLoader(true);
    }

    stopLoader(): void {
        this.dependencies.coreServices.sharedService.setLoader(false);
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

    resolveFullScreenLoader(): void {
        this.dependencies.tdServices.loadingService.resolve(this.fullscreenLoaderName);
    }

    registerFullScreenLoader(): void {
        this.dependencies.tdServices.loadingService.register(this.fullscreenLoaderName);
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