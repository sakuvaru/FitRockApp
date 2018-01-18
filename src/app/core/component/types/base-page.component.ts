import { OnDestroy, OnInit } from '@angular/core';
import { ComponentAction } from 'app/core';
import { Observable } from 'rxjs/Rx';

import { ErrorReasonEnum, ErrorResponse } from '../../../../lib/repository';
import { AppConfig } from '../../../config';
import { AuthenticatedUser, LanguageConfig, MenuItem, ResourceKey } from '../../models/core.models';
import { BaseComponent } from '../base.component';
import { ComponentDependencyService } from '../component-dependency.service';
import { ComponentSetup } from '../component-setup.class';
import { ComponentConfig } from '../component.config';

export abstract class BasePageComponent extends BaseComponent implements OnInit, OnDestroy {

    /**
     * Indicates if current component is nested (= BaseComponent is used within another BaseComponent)
     * All components that can be nested need to have this enabled to prevent issues such as multiple 
     * subscriptions to repository errors
     */
    protected isNestedComponent: boolean = false;

    /**
     * Duration for snackbar
     */
    private readonly snackbarDefaultDuration: number = 2500;

    // translations
    private snackbarSavedText: string;
    private snackbarDeletedText: string;
    private dialogErrorTitle: string;
    private dialogDefaultError: string;
    private dialogCloseButton: string;
    private dialogDynamicTranslationMessage: string;
    private dialogDynamicTranslationTitle: string;

    /**
     * Component config
     */
    protected componentConfig: ComponentConfig = new ComponentConfig();

    /**
     * Indicates if component subscribed to repository errors
     */
    private subscribedToRepositoryErrors: boolean = false;

    /**
    * Every child component should setup its base config.
    * This is setup during the component initialization and should serve
    * different purpose then the ComponentConfig which can be set at any time during the component lifecycle.
    * If no setup is provided, default setup will be used
    */
    abstract setup(): ComponentSetup;

    constructor(protected dependencies: ComponentDependencyService) {
        super(dependencies);
        this.setupComponent();
    }

    // ----------------------- Lifecycle Events --------------------- // 

    /**
     * If a child component implements its own ngOnInit, it needs to call 'super.ngOnInit' as otherwise
     * this method will not be called.
     */
    ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnDestroy' as otherwise
     * this method will not be called.
     */
    ngOnDestroy(): void {
        super.ngOnDestroy();
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
            menuAvatarUrl?: string,
            actions?: ComponentAction[]
        }): void {
        if (options) {
            Object.assign(this.componentConfig, options);
        }
        this.componentConfig.setDefaultValues();
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    // --------------------- Error handlers -------------- // 

    private handleSubscribeError(error: any): void {
        // no need to do anything here as errors are handled with handleAppError
    }

    protected handleAppError(error: any): void {
        // force stop all loaders
        this.stopAllLoaders(true);

        if (AppConfig.DevModeEnabled) {
            // log errors to console in dev mode
            console.error(error);
        }

        if (error instanceof ErrorResponse) {
            // don't do anything if its form error as these error should be handled by individual components
            if (error.reason === ErrorReasonEnum.FormError) {
                return;
            }

            // don't handle auth exception as they are handled by register form directly
            if (error.reason === ErrorReasonEnum.AuthException) {
                return;
            }

            // handle server not running error
            if (error.reason === ErrorReasonEnum.ServerNotRunning) {
                this.dependencies.coreServices.navigateService.serverDownPage().navigate();
                return;
            }

            // handle not found error
            if (error.reason === ErrorReasonEnum.NotFound) {
                this.dependencies.coreServices.navigateService.item404().navigate();
                return;
            }

            // handle situation where user was logged out (e.g. due to long inactivity)
            if (error.reason === ErrorReasonEnum.NotAuthorized) {
                this.dependencies.coreServices.navigateService.loginPage().navigate();
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

        // shared setup
        this.sharedSetup(setup);

        // nested vs non-nested setup
        if (setup.isNested) {
            this.setupNestedComponent(setup);
        } else {
            this.setupNonNestedComponent(setup);
        }
    }

    private sharedSetup(setup: ComponentSetup): void {
        // translations
        this.dependencies.coreServices.localizationService.get('shared.saved')
            .takeUntil(this.ngUnsubscribe)
            .subscribe(text => this.snackbarSavedText = text);

        this.dependencies.coreServices.localizationService.get('shared.deleted')
            .takeUntil(this.ngUnsubscribe)
            .subscribe(text => this.snackbarDeletedText = text);
    }

    private setupNestedComponent(setup: ComponentSetup): void {
        // no special logic needed for nested component right now
    }

    private setupNonNestedComponent(setup: ComponentSetup): void {
        // subscribe to repository errors only for non nested components as otherwise
        // the repository could have multiple subscriptions which would result in multiple
        // errors occuring
        if (this.shouldSubscribeToRepositoryErrors(setup)) {
            //  this.subscribeToRepositoryErrors();
        }
    }

    private initializeComponent(initialize: boolean = true): void {
        const currentSetup = this.setup();
        if (currentSetup) {
            currentSetup.initialized = initialize;
        } else {
            throw Error(`Component was not initialized`);
        }
        this.dependencies.coreServices.sharedService.setComponentSetup(currentSetup);
    }

    private shouldSubscribeToRepositoryErrors(setup: ComponentSetup): boolean {
        if (setup.disableRepositoryErrors) {
            return false;
        }
        return true;
    }

    private subscribeToRepositoryErrors(): void {
        if (this.subscribedToRepositoryErrors) {
            return;
        }

        this.subscribedToRepositoryErrors = true;

        this.dependencies.coreServices.repositoryClient.queryService.error
            .map(error => {
                this.handleAppError(error);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();

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
                this.handleSubscribeError(error);
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
                this.handleSubscribeError(error);
            }
            );
    }
}
