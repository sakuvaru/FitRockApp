// common
import { Component, Input, Output, OnDestroy } from '@angular/core';
import { AppConfig } from '../core/config/app.config';
import { BaseComponent } from '../core/base/base.component';
import { AppData } from '../core/app-data.class';
import { ComponentDependencyService } from '../core/component-dependency.service';

// required by component
import { TdMediaService } from '@covalent/core';
import { AppDataService } from '../core/app-data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent implements OnDestroy {
    private appData: AppData = new AppData('Dashboard');
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