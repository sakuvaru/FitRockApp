// common
import { Component, Input, OnDestroy } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { IComponentConfig, ComponentDependencyService, BaseComponent } from '../core';

// required by component
import { Subscription } from 'rxjs/RX';

@Component({
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent extends BaseComponent implements OnDestroy {
    private media: TdMediaService;

    private componentConfigSubscription: Subscription;
    private componentTitle: string;
    private menuTitle: string;

    constructor(
        protected dependencies: ComponentDependencyService,
    ) {
        super(dependencies)
        // don't forget to unsubscribe
        this.componentConfigSubscription = dependencies.coreServices.sharedService.componentConfigChanged$.subscribe(
            componentConfig => {
                this.componentConfig = componentConfig;

                // resolve component's title using translation services
                if (componentConfig.componentTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.componentTitle.key, componentConfig.componentTitle.data)
                        .subscribe(text => this.componentTitle = text);
                }

                // resolve menu title using translation services
                if (componentConfig.menuTitle) {
                    this.dependencies.coreServices.translateService.get(componentConfig.menuTitle.key, componentConfig.menuTitle.data)
                        .subscribe(text => this.menuTitle = text);
                }
            });

        // set alias for media
        this.media = dependencies.tdServices.mediaService;
    }

    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        // note required by 'Covalent' for its templates
        // source: https://teradata.github.io/covalent/#/layouts/manage-list
        this.dependencies.tdServices.mediaService.broadcast();
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        // source: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
        this.componentConfigSubscription.unsubscribe();
    }
}