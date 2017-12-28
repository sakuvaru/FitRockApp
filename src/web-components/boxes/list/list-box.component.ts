import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { ListBoxConfig, ListBoxItem } from './list-box.models';

@Component({
    selector: 'list-box',
    templateUrl: 'list-box.component.html'
})
export class ListBoxComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Config
     */
    @Input() config: ListBoxConfig;

    /**
     * Used for loading items
     */
    private loadItems$ = new Subject<void>();

    /**
     * Items
     */
    public items?: ListBoxItem[];

    /**
     * Indicates if list box is initialized
     */
    private initialized: boolean = false;

    /*
    * Indicates if loader is enabled 
    */
    public loaderEnabled: boolean = false;

    /**
     * Indicates if error occured
     */
    public errorOccured: boolean = false;

    constructor(
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.initListBox();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initListBox();
    }

    loadItems(): void {
        this.loadItems$.next();
    }

    resolveAction(obs: Observable<void>): void {
        obs
            .takeUntil(this.ngUnsubscribe)
            .subscribe()
            .unsubscribe();
    }

    redirectTo(url: string): void {
        this.router.navigate([url]);
    }

    isObservable(value: string | Observable<string>): boolean {
        return observableHelper.isObservable(value);
    }

    private initListBox(): void {
        if (this.initialized || !this.config) {
            return;
        }

        this.initialized = true;

        this.subscribeToLoadItems();

        this.loadItems();
    }

    private subscribeToLoadItems(): void {
        this.loadItems$
            .do(() => {
                this.loaderEnabled = true;
                this.resetErrors();
            })
            .switchMap(() => this.config.items)
            .map(items => {
                this.items = items;

                this.loaderEnabled = false;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => undefined, err => this.handleError(err));
    }

    private handleError(error: any): void {
        console.error(error);
        this.errorOccured = true;
        this.loaderEnabled = false;
    }

    private resetErrors(): void {
        this.errorOccured = false;
    }
}
