import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { MenuItem, ResourceKey } from '../../models/core.models';
import { BaseComponent } from '../base.component';
import { ComponentDependencyService } from '../component-dependency.service';
import { ComponentConfig } from '../component.config';
import { IComponentConfig } from '../icomponent-config.interface';


export abstract class BasePageComponent extends BaseComponent implements OnInit, OnDestroy {

    /**
     * Indicates if current component is nested (= BaseComponent is used within another BaseComponent)
     * All components that can be nested need to have this enabled to prevent issues such as multiple 
     * subscriptions to repository errors
     */
    protected isNestedComponent: boolean = false;

    /**
     * Component config
     */
    protected componentConfig: ComponentConfig = new ComponentConfig();

    constructor(protected dependencies: ComponentDependencyService,
        protected activatedRoute?: ActivatedRoute,
        options?: IComponentConfig) {
        super(dependencies);

        if (options) {
            this.setConfig(options);
        }
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
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    updateComponentTitle(title: ResourceKey): void {
        this.componentConfig.componentTitle = title;
        this.componentConfig.setDefaultValues();
        this.dependencies.coreServices.sharedService.setComponentConfig(this.componentConfig);
    }

    setConfig(options: IComponentConfig): void {
        const config = new ComponentConfig();

        Object.assign(config, options);

        this.componentConfig = config;
    
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
            },
            error => {
                this.stopAllLoaders();
                super.handleSubscribeError(error);
            }
            );
    }

    // --------------- Component initialization  ------------------ //

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
