import { OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';

import { ErrorReasonEnum, ErrorResponse } from '../../../lib/repository';
import { AppConfig, UrlConfig } from '../../config';
import { AuthenticatedUser, LanguageConfig, MenuItem, ResourceKey } from '../models/core.models';
import { ComponentDependencyService } from './component-dependency.service';
import { ComponentSetup } from './component-setup.class';
import { ComponentConfig } from './component.config';

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

    // language
    protected currentLanguage?: LanguageConfig;

    // auth user
    protected authUser?: AuthenticatedUser;

    /**
    * Every child component should setup its base config.
    * This is setup during the component initialization and should serve
    * different purpose then the ComponentConfig which can be set at any time during the component lifecycle.
    * If no setup is provided, default setup will be used
    */
    abstract setup(): ComponentSetup | null | undefined;

    constructor(protected dependencies: ComponentDependencyService) {
    }

    // ----------------------- Lifecycle Events --------------------- // 

    /**
     * If a child component implements its own ngOnInit, it needs to call 'super.ngOnInit' as otherwise
     * this method will not be called.
     */
    ngOnInit(): void {
        this.setupComponent();
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
        this.dependencies.router.navigate([redirectHandlerUrl], { queryParams: { 'url': url }, queryParamsHandling: 'merge' });
    }

    navigate(commands: any[], extras?: NavigationExtras): void {
        this.dependencies.router.navigate(commands, extras);
    }

    navigateTo404(): void {
        this.dependencies.router.navigate([UrlConfig.getItem404()]);
    }

    navigateToLogonPage(): void {
        this.dependencies.router.navigate([UrlConfig.getLoginUrl()]);
    }

    navigateToMainPage(): void {
        const currentUser = this.dependencies.authenticatedUserService.getUser();
        if (currentUser == null) {
            // user is not authenticated, redirect him to login page
            this.navigateToLogonPage();
            return;
        }
        this.dependencies.router.navigate([UrlConfig.getEntryUrl()]);
    }

    navigateToErrorPage(): void {
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
            menuAvatarUrl?: string
        }): void {
        if (options) {
            Object.assign(this.componentConfig, options);
        }
        this.componentConfig.setDefaultValues();
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    // --------------------- Error handlers -------------- // 

    protected handleAppError(error: any): void {
        // force stop all loaders
        this.stopAllLoaders(true);

        if (AppConfig.DevModeEnabled) {
            // log errors to console in dev mode
            console.error(error);
        }

        if (error instanceof ErrorResponse) {
            // handle server not running error
            if (error.reason === ErrorReasonEnum.ServerNotRunning) {
                this.dependencies.router.navigate([UrlConfig.getServerDown()]);
                return;
            }

            // handle not found error
            if (error.reason === ErrorReasonEnum.NotFound) {
                this.dependencies.router.navigate([UrlConfig.getItem404()]);
                return;
            }

            // handle situation where user was logged out (e.g. due to long inactivity)
            if (error.reason === ErrorReasonEnum.NotAuthorized) {
                this.dependencies.router.navigate([UrlConfig.getLoginUrl()]);
                return;
            }

            // handle license error
            if (error.reason === ErrorReasonEnum.LicenseLimitation) {
                this.showErrorDialog('errors.invalidLicense');
                return;
            }
            // handle unknown ErrorResponse error
            this.showErrorDialog();
        } else {
            // handle unknown error
            this.showErrorDialog();
        }
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
        this.dependencies.mdServices.snackbarService.open(message, undefined, { duration: this.snackbarDefaultDuration });
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
        const useKey = !key ? 'errors.dialogDefaultError' : key;
        const titleKey = 'errors.dialogErrorTitle';

        this.showDialog(useKey, titleKey);
    }

    showDialog(messageKey: string, titleKey?: string): void {
        // reset current translations
        this.dialogDynamicTranslationMessage = '';
        this.dialogDynamicTranslationTitle = '';

        const observables: Observable<any>[] = [];

        observables.push(this.translate(messageKey).map(text => this.dialogDynamicTranslationMessage = text));

        if (titleKey) {
            observables.push(this.translate(titleKey).map(text => this.dialogDynamicTranslationTitle = text));
        }

        if (!this.dialogCloseButton) {
            observables.push(this.translate('shared.close').map(text => this.dialogCloseButton = text));
        }

        const zippedObservable = this.dependencies.helpers.observableHelper.zipObservables(observables)
            .map(() => {
                this.dependencies.tdServices.dialogService.openAlert({
                    message: this.dialogDynamicTranslationMessage,
                    title: this.dialogDynamicTranslationTitle,
                    closeButton: this.dialogCloseButton
                });
            });

        this.subscribeToObservable(zippedObservable);
    }

    // --------------- Component initialization  ------------------ //

    protected setupComponent(): void {
        const setup = this.setup();
        if (setup) {
            this.dependencies.coreServices.sharedService.setComponentSetup(setup);
        }

        // init current language
        this.currentLanguage = this.dependencies.coreServices.currentLanguageService.getLanguage();

        // init auth user
        this.authUser = this.dependencies.authenticatedUserService.getUser();

        // stop loaders on component init 
        this.dependencies.coreServices.sharedService.setGlobalLoader(false, false);

        // authenticate user when logging-in (handles the params in URL and extracts token
        // more info: https://auth0.com/docs/quickstart/spa/angular2/02-custom-login
        if (!this.dependencies.coreServices.authService.isAuthenticated()) {
            this.dependencies.coreServices.authService.handleAuthentication();
        }

        // translations
        this.dependencies.coreServices.localizationService.get('shared.saved').subscribe(text => this.snackbarSavedText = text);

        this.dependencies.coreServices.localizationService.get('shared.deleted').subscribe(text => this.snackbarDeletedText = text);
    }

    protected initializeComponent(initialize: boolean = true): void {
        let currentSetup = this.setup();
        if (currentSetup) {
            currentSetup.initialized = initialize;
        } else {
            currentSetup = { initialized: initialize };
        }
        this.dependencies.coreServices.sharedService.setComponentSetup(currentSetup);
    }

    // --------------- Common method aliases ------------------ //
    translate(key: string, data?: any): Observable<string> {
        return this.dependencies.coreServices.localizationService.get(key, data);
    }

    formatDate(date: Date): string {
        return this.dependencies.coreServices.timeService.formatDate(date);
    }

    fromNow(date: Date): string {
        return this.dependencies.coreServices.timeService.fromNow(date);
    }

    // -------------- Observable subscriptions -------------- //

    protected subscribeToObservables(observables: Observable<any>[], options?: {
        enableLoader?: boolean,
        setComponentAsInitialized?: boolean
    }): void {

        let enableLoader;
        let setComponentAsInitialized;

        if (!options) {
            enableLoader = true;
            setComponentAsInitialized = true;
        } else {
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
                    this.initializeComponent(true);
                }
            },
            error => {
                this.stopAllLoaders();
                this.handleAppError(error);
            }
            );
    }

    protected subscribeToObservable(observable: Observable<any>, options?: {
        enableLoader?: boolean,
        setComponentAsInitialized?: boolean
    }): void {

        let enableLoader;
        let setComponentAsInitialized;

        if (!options) {
            enableLoader = true;
            setComponentAsInitialized = true;
        } else {
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
                    this.initializeComponent(true);
                }
            },
            error => {
                this.stopAllLoaders();
                this.handleAppError(error);
            }
            );
    }
}
