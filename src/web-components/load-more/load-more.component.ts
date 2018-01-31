import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';
import * as _ from 'underscore';

import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';
import { LoadMoreConfig } from './load-more.config';

@Component({
    selector: 'load-more',
    templateUrl: 'load-more.component.html'
})
export class LoadMoreComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() config: LoadMoreConfig;

    /**
   * Why use subject for on click events?
   * => Because we want to cancel requests if new request comes before the old one returns value
   * More info: https://github.com/angular/angular/issues/5876 -> response from 'robwormald commented on Dec 30, 2015'
   */
    public loadMoreSubject: Subject<boolean> = new Subject<boolean>();

    /**
     * Resolved data
     */
    public items: any[] = [];

    /**
     * Search control
     */
    public searchControl = new FormControl();

    /**
     * Debounce time for search
     */
    private readonly searchDebounce: number = 300;

    /**
     * Current page
     */
    public currentPage = 1;

    /**
     * Total number of pages with given page size
     */
    public totalPages: number = 0;

    /**
     * Total number of items
     */
    public totalItems: number = 0;

    /**
     * Current search term
     */
    public search: string = '';

    /**
     * Indicates if show more button is displayed
     */
    public showMoreButton = false;

    /**
    * Indicates if the load of items is the initial load
    */
    public isFirstLoad = true;

    /**
     * Indicates if some data were already loaded
     */
    public dataLoaded: boolean = false;

    /**
     * Indicates if there was a loading error
     */
    public loadingError: boolean = false;

    /**
    * Flag for initialization component, used because ngOnChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    public initialized = false;

    /**
     * Indicates if local loader is active
     */
    public loaderEnabled = false;

    /**
     * Indicates if all data was loaded
     */
    public get allDataLoaded(): boolean {
        if (this.totalPages === this.currentPage) {
            return true;
        }
        return false;
    }

    constructor(
        private localizationService: LocalizationService
    ) {
        super();
    }

    ngOnInit() {
        if (this.config) {
            this.initLoadMoreComponent();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            this.initLoadMoreComponent();
        }
    }

    loadNextPage(): void {
        this.currentPage++;
        this.reloadData();
    }

    private initLoadMoreComponent() {
        if (!this.config || this.initialized) {
            return;
        }

        this.initialized = true;

        // subscribe to load more button clicks
        this.subscribeToLoadMoreEvents();

        // subscribe to search input events
        this.subscribeToSearchEvents();

        // load items
        this.reloadData();
    }

    private getLoadObservable(appendItems: boolean): Observable<void> {
        // prepare data
        if (!this.config.data) {
            throw Error(`Could not load data because no load function was provided`);
        }

        const dataObs = this.config.data(this.currentPage, this.config.pageSize, this.search)
            .map(response => {
                this.totalPages = response.pages;
                this.totalItems = response.totalItems;

                if (response.items) {
                    if (appendItems) {
                        this.items = _.union(this.items, response.items);
                    } else {
                        this.items = response.items;
                    }
                }

                this.dataLoaded = true;
            });

        return dataObs;
    }

    private subscribeToLoadMoreEvents(): void {
        this.loadMoreSubject
            .do(() => {
                // clear errors
                this.clearErrors();

                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = true;
                }

                if (this.config.onBeforeLoad) {
                    this.config.onBeforeLoad(this.isFirstLoad);
                }
            })
            .switchMap(() => this.getLoadObservable(true))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = false;
                }

                if (this.config.onAfterLoad) {
                    this.config.onAfterLoad(this.isFirstLoad);
                }

                this.isFirstLoad = false;
            },
            error => this.handleError(error));
    }

    private handleError(error: any): void {
        this.loadingError = true;
    }

    private clearErrors(): void {
        this.loadingError = false;
    }

    private reloadData(): void {
        this.loadMoreSubject.next(true);
    }

    private subscribeToSearchEvents(): void {
        this.searchControl.valueChanges
            .debounceTime(this.searchDebounce)
            .map(text => {
                // reset page to 1 when searching
                this.currentPage = 1;
                this.search = text;

                // reload data
                this.reloadData();
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }
}
