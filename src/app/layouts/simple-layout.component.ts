// common
import { Component, Input, OnDestroy } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { AppConfig, AppData, ComponentDependencyService, BaseComponent, AppDataService } from '../core';

// required by component
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent implements OnDestroy {
    private appData: AppData = new AppData();
    private media: TdMediaService;
    private subscription: Subscription;

    constructor(private dependencies: ComponentDependencyService) {
        this.subscription = dependencies.appDataService.appDataChanged$.subscribe(
            newAppData => {
                this.appData = newAppData;
            });

        this.media = dependencies.mediaService;
    }

    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        // note required by 'Covalent' for its templates
        // source: https://teradata.github.io/covalent/#/layouts/manage-list
        this.dependencies.mediaService.broadcast();
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        // source: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
        this.subscription.unsubscribe();
    }
}