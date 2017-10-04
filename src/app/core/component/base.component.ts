import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AppConfig } from '../config/app.config';
import { UrlConfig } from '../config/url.config';
import { ComponentDependencyService } from './component-dependency.service';
import { ErrorResponse, ErrorReasonEnum } from '../../../lib/repository';
import { ComponentConfig } from './component.config';
import { AdminMenu } from './admin-menu';
import { MenuItem, ResourceKey } from '../models/core.models';
import { Observable, Subject } from 'rxjs/Rx';
import { NavigationExtras } from '@angular/router'

// moment js
import * as moment from 'moment';

@Component({
})
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

    // snackbar config
    private readonly snackbarDefaultDuration: number = 2500;

    // locale config for moment js (https://momentjs.com/)
    private readonly defaultMomentLocale: string = 'cs';

    // translations
    private snackbarSavedText: string;
    private snackbarDeletedText: string;
    private dialogErrorTitle: string;
    private dialogDefaultError: string;
    private dialogCloseButton: string;
    private dialogDynamicTranslationMessage: string;
    private dialogDynamicTranslationTitle: string;

    // component config
    protected componentConfig: ComponentConfig = new ComponentConfig();

    // image used when no image is found
    protected readonly defaultImageSrc: string = 'https://semantic-ui.com/images/avatar/large/elliot.jpg';

    // admin menu
    protected adminMenu: AdminMenu = new AdminMenu();

    constructor(protected dependencies: ComponentDependencyService) {
        // set component as not initialized when its constructed
        this.setComponentAsInitialized(false);

        // stop loaders on component init 
        this.dependencies.coreServices.sharedService.setGlobalLoader(false, false);

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

        // translations
        this.dependencies.coreServices.translateService.get('shared.saved').subscribe(text => this.snackbarSavedText = text);

        this.dependencies.coreServices.translateService.get('shared.deleted').subscribe(text => this.snackbarDeletedText = text);
    }

    // ----------------------- Lifecycle Events --------------------- // 

    /**
     * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnInit' as otherwise
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
        var redirectHandlerUrl = this.getAppUrl(UrlConfig.Redirect);
        this.dependencies.router.navigate([redirectHandlerUrl], { queryParams: { 'url': url }, queryParamsHandling: "merge" });
    }

    navigate(commands: any[], extras?: NavigationExtras): void {
        this.dependencies.router.navigate(commands, extras);
    }

    navigateTo404(): void {
        this.dependencies.router.navigate([UrlConfig.getItem404()]);
    }

    navigateToError(): void {
        this.dependencies.router.navigate([UrlConfig.getAppErrorUrl()]);
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
            menuTitle?: ResourceKey,
            enableSearch?: boolean,
            autoInitComponent?: boolean,
            menuAvatarUrl?: string
        }): void {
        if (options) {
            Object.assign(this.componentConfig, options);
        }
        this.componentConfig.setDefaultValues();
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    // --------------------- Error handlers -------------- // 

    protected handleError(error: any): void {
        if (AppConfig.DevModeEnabled) {
            // log errors to console in dev mode
            console.error(error);
        }

        if (error instanceof ErrorResponse) {
            // handle license error
            if (error.reason == ErrorReasonEnum.LicenseLimitation) {
                this.showErrorDialog('errors.invalidLicense');
            }
            // handle unknown ErrorResponse error
            this.showErrorDialog();
        }
        else {
            // handle unknown error
            this.showErrorDialog();
        }

        // force stop all loaders
        this.stopAllLoaders(true);
    }

    /**
     * Error that could not be handled in any other way
     * @param error Error
     */
    protected handleFatalError(error: any): void {
        console.error('Fatal error:');
        console.error(error);
    }

    // --------------- Snackbar ------------------- //

    showSnackbar(message: string): void {
        let snackBarRef = this.dependencies.mdServices.snackbarService.open(message, undefined, { duration: this.snackbarDefaultDuration });
    }

    showSavedSnackbar(): void {
        this.showSnackbar(this.snackbarSavedText);
    }

    showDeletedSnackbar(): void {
        this.showSnackbar(this.snackbarDeletedText);
    }

    // --------------- Urls ------------------- //

    getClientUrl(action?: string): string {
        return '/' + UrlConfig.getClientUrl(action);
    }

    getAppUrl(action: string): string {
        return '/' + UrlConfig.getAppUrl(action);
    }

    getAuthUrl(action?: string): string {
        return '/' + UrlConfig.getAuthUrl(action);
    }

    getTrainerUrl(action?: string): string {
        return '/' + UrlConfig.getTrainerUrl(action);
    }

    // --------------- Dialogs ------------------- //

    showErrorDialog(key?: string): void {
        var useKey = !key ? 'errors.dialogDefaultError' : key;
        var titleKey = 'errors.dialogErrorTitle';

        this.showDialog(useKey, titleKey);
    }

    showDialog(messageKey: string, titleKey?: string): void {
        // reset current translations
        this.dialogDynamicTranslationMessage;
        this.dialogDynamicTranslationTitle;

        var observables: Observable<any>[] = [];

        observables.push(this.translate(messageKey).map(text => this.dialogDynamicTranslationMessage = text));

        if (titleKey) {
            observables.push(this.translate(titleKey).map(text => this.dialogDynamicTranslationTitle = text));
        }

        if (!this.dialogCloseButton) {
            observables.push(this.translate('shared.close').map(text => this.dialogCloseButton = text));
        }

        var zippedObservable = this.dependencies.helpers.observableHelper.zipObservables(observables)
            .map(() => {
                this.dependencies.tdServices.dialogService.openAlert({
                    message: this.dialogDynamicTranslationMessage,
                    title: this.dialogDynamicTranslationTitle,
                    closeButton: this.dialogCloseButton
                });
            })

        this.subscribeToObservable(zippedObservable);
    }

    // --------------- Global component initialization flag ------------------ //

    protected setComponentAsInitialized(isInitialized: boolean): void {
        this.dependencies.coreServices.sharedService.setComponentIsInitialized(isInitialized);
    }

    // --------------- Component as dialog helper --------------------- //

    /**
     * Call this method in constructor of dialog components
     */
    protected isDialog(): void {
        // this makes sure that if the dialog is closed, the parent component is still marked as 
        // initialized
        this.setComponentAsInitialized(true);
    }

    // --------------- Useful aliases ------------------ //
    translate(key: string, data?: any): Observable<string> {
        return this.dependencies.coreServices.translateService.get(key, data);
    }

    moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): moment.Moment {
        return this.dependencies.coreServices.moment(inp, format, strict).locale(this.defaultMomentLocale);
    }
    momentLanguage(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment {
        return this.dependencies.coreServices.momentLanguage(inp, format, language, strict).locale(this.defaultMomentLocale);
    }

    formatDate(date: Date): string {
        return this.moment(date).format('D MMMM hh:mm');
    }

    fromNow(date: Date): string {
        return this.moment(date).fromNow();
    }

    // -------------- Observable subscriptions -------------- //
    private completedObservablesCount: number = 0;

    protected subscribeToObservables(observables: Observable<any>[], options?: {
        enableLoader?: boolean,
        setComponentAsInitialized?: boolean
    }): void {

        var enableLoader;
        var setComponentAsInitialized;

        if (!options) {
            enableLoader = true;
            setComponentAsInitialized = true;
        }
        else {
            enableLoader = options.enableLoader;
            setComponentAsInitialized = options.setComponentAsInitialized;
        }

        if (enableLoader) {
            this.startGlobalLoader();
        }

        this.dependencies.helpers.observableHelper.zipObservables(observables)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((val) => {
                this.stopAllLoaders();

                if (setComponentAsInitialized) {
                    this.setComponentAsInitialized(true)
                }
            },
            error => this.handleError(error)
            );
    }

    protected subscribeToObservable(observable: Observable<any>, options?: {
        enableLoader?: boolean,
        setComponentAsInitialized?: boolean
    }): void {

        var enableLoader;
        var setComponentAsInitialized;

        if (!options) {
            enableLoader = true;
            setComponentAsInitialized = true;
        }
        else {
            enableLoader = options.enableLoader;
            setComponentAsInitialized = options.setComponentAsInitialized;
        }

        if (enableLoader) {
            this.startGlobalLoader();
        }

        observable
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.stopAllLoaders();

                // set component as initialized
                if (setComponentAsInitialized) {
                    this.setComponentAsInitialized(true)
                }
            },
            error => this.handleError(error)
            );
    }
}