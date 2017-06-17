// common
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { AppConfig, UrlConfig, AppData, ComponentDependencyService, BaseComponent, AppDataService } from '../core';

// required by component
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseComponent implements OnDestroy {
    private media: TdMediaService;
    private subscription: Subscription;

    /**
     * Part of url identifying 'client' or 'trainer' app type
     */
    private urlSegment: string;

    constructor(
        protected dependencies: ComponentDependencyService,
        private cdr: ChangeDetectorRef,
    ) {
        super(dependencies)
        // don't forget to unsubscribe
        this.subscription = dependencies.appDataService.appDataChanged$.subscribe(
            newAppData => {
                this.appData = newAppData;
            });

        this.media = dependencies.mediaService;
    }

    ngAfterViewInit(): void {
        this.media.broadcast();
        // broadcast to all listener observables when loading the page
        // note required by 'Covalent' for its templates
        // source: https://teradata.github.io/covalent/#/layouts/manage-list
        // + broadcast change detection issue, see - https://github.com/Teradata/covalent/issues/425
        // + fixed with ChangeDetectorRef => https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        // prevent memory leaks when component is destroyed
        // source: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
        this.subscription.unsubscribe();
    }

    private getTrainerColor(action: string, perfectMatch: boolean): string {
        var url = this.getTrainerUrl(action);

        var currentUrl = this.dependencies.router.url;

        if (perfectMatch) {
            if (url === currentUrl) {
                return 'primary';
            }
        }
        else {
            if (currentUrl.startsWith(url)) {
                return 'primary';
            }
        }

        return null;
    }

    private getPublicColor(action: string, perfectMatch: boolean): string {
        var url = this.getPublicUrl(action);

        var currentUrl = this.dependencies.router.url;

        if (perfectMatch) {
            if (url === currentUrl) {
                return 'primary';
            }
        }
        else {
            if (currentUrl.startsWith(url)) {
                return 'primary';
            }
        }
        return null;
    }
}