import { Router } from '@angular/router';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { ListBoxItem, ListBoxConfig } from './list-box.models';

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
            })
            .switchMap(() => this.config.items)
            .map(items => {
                this.items = items;

                this.loaderEnabled = false;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private redirectTo(url: string): void {
        this.router.navigate([url]);
    }
}
