// common
import { Component, Input, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { IComponentConfig, ComponentDependencyService, BaseComponent } from '../core';

// required by component
import { Subscription } from 'rxjs/Rx';

@Component({
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent extends BaseComponent implements OnDestroy, OnInit {
    private media: TdMediaService;

    private componentTitle: string;
    private menuTitle: string;

    private topLoaderEnabled: boolean;

    // subscriptions - unsubscribe 
    private topLoaderSubscription: Subscription;
    private componentConfigSubscription: Subscription;

    constructor(
        private cdr: ChangeDetectorRef,
        protected dependencies: ComponentDependencyService,
    ) {
        super(dependencies)
        
        // set alias for media
        this.media = this.dependencies.tdServices.mediaService;
    }

    ngOnInit() {
        // don't forget to unsubscribe
        this.topLoaderSubscription = this.dependencies.coreServices.sharedService.topLoaderChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            enabled => {
                this.topLoaderEnabled = enabled;
                this.cdr.detectChanges();
            });

        this.componentConfigSubscription = this.dependencies.coreServices.sharedService.componentConfigChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            componentConfig => {
                this.componentConfig = componentConfig;

                // resolve component's title using translation services
                if (componentConfig.componentTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.componentTitle.key, componentConfig.componentTitle.data)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => this.componentTitle = text);
                }

                // resolve menu title using translation services
                if (componentConfig.menuTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.menuTitle.key, componentConfig.menuTitle.data)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(text => this.menuTitle = text);
                }
            });
    }

    ngAfterViewInit(): void {
        this.dependencies.tdServices.mediaService.broadcast();
        // broadcast to all listener observables when loading the page
        // note required by 'Covalent' for its templates
        // source: https://teradata.github.io/covalent/#/layouts/manage-list
        // + broadcast change detection issue, see - https://github.com/Teradata/covalent/issues/425
        // + fixed with ChangeDetectorRef => https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
        // mentioned in official doc now -> https://teradata.github.io/covalent/#/layouts/manage-list
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        // source: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service

        // in some cases subscription is not yet initialized (e.g. when navigating from constructor), check for null
        if (this.componentConfigSubscription != null){
            this.componentConfigSubscription.unsubscribe();
        }

        if (this.topLoaderSubscription != null){
            this.topLoaderSubscription.unsubscribe();
        }
    }
}