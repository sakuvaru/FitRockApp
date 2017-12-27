import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { InfoBoxConfig, InfoBoxLine } from './info-box.models';

@Component({
    selector: 'info-box',
    templateUrl: 'info-box.component.html'
})
export class InfoBoxComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Config
     */
    @Input() config: InfoBoxConfig;

    /**
     * Used for loading items
     */
    private loadItem$ = new Subject<void>();

    /**
     * Lines
     */
    public lines: InfoBoxLine[] | undefined;

    /**
     * Indicates if list box is initialized
     */
    private initialized: boolean = false;

    /*
    * Indicates if loader is enabled 
    */
    public loaderEnabled: boolean = false;

    constructor(
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.initInfoBox();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initInfoBox();
    }

    loadItem(): void {
        this.loadItem$.next();
    }

    private initInfoBox(): void {
        if (this.initialized || !this.config) {
            return;
        }

        this.initialized = true;

        this.subscribeToLoadItem();

        this.loadItem();
    }

    private subscribeToLoadItem(): void {
        this.loadItem$
            .do(() => {
                this.loaderEnabled = true;
            })
            .switchMap(() => this.config.lines)
            .map(items => {
                this.lines = items;

                this.loaderEnabled = false;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private redirectTo(url: string): void {
        this.router.navigate([url]);
    }

    private isObservable(value: string | Observable<string>): boolean {
        return observableHelper.isObservable(value);
    }
}
