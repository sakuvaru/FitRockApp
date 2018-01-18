import { OnDestroy, OnInit } from '@angular/core';
import { ComponentAction } from 'app/core';
import { Observable } from 'rxjs/Rx';

import { MenuItem, ResourceKey } from '../../models/core.models';
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

    /**
     * Component config
     */
    protected componentConfig: ComponentConfig = new ComponentConfig();

    /**
    * Every child component should setup its base config.
    * This is setup during the component initialization and should serve
    * different purpose then the ComponentConfig which can be set at any time during the component lifecycle.
    * If no setup is provided, default setup will be used
    */
    abstract setup(): ComponentSetup;

    constructor(protected dependencies: ComponentDependencyService,
        options?: {
            subscribedToRepositoryErrors?: boolean
        }) {
        super(dependencies, options);
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
                super.handleSubscribeError(error);
            }
            );
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
}
