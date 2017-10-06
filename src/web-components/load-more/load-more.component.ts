// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseWebComponent } from '../base-web-component.class';
import { LoadMoreConfig } from './load-more.config';
import { ResponseMultiple } from '../../lib/repository';
import * as _ from 'underscore';
import { Observable, Subject } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { LoadMoreField } from './load-more-field.class';

@Component({
    selector: 'load-more',
    templateUrl: 'load-more.component.html'
})
export class LoadMoreComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() config: LoadMoreConfig<any>;

    /**
   * Why use subject for on click events? 
   * => Because we want to cancel requests if new request comes before the old one returns value
   * More info: https://github.com/angular/angular/issues/5876 -> response from 'robwormald commented on Dec 30, 2015'
   */
    private loadMoreButtonSubject: Subject<void>;

    // resolved data
    private items: any[];

    /**
     * Search control
     */
    private searchControl = new FormControl();

    /**
     * Debounce time for search
     */
    private readonly searchDebounce: number = 300;

    /**
     * Current page
     */
    private currentPage: number = 1;

    /**
     * Total number of pages with given page size
     */
    private totalPages: number;

    /**
     * Current search term
     */
    private searchTerm: string = '';

    /**
     * Indicates if show more button is displayed
     */
    private showMoreButton: boolean = false;

    /**
    * Indicates if the load of items is the initial load
    */
    private isInitialLoad: boolean = true;

    /**
     * Indicates if component was initialized
     */
    private initialized: boolean = false;

    /**
     * Indicates if local loader is active
     */
    private localLoaderLoading: boolean = false;

    constructor(
        private translateService: TranslateService
    ) {
        super()
    }

    ngOnInit() {
        if (this.config){
            this.initLoadMoreComponent(this.config);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            this.initLoadMoreComponent(changes.config.currentValue);
        }
    }

    private initLoadMoreComponent(config: LoadMoreConfig<any>) {
        if (!config || this.initialized) {
            return;
        }

        this.config = config;

        this.getInitLoadMoreButtonObservable()
            .zip(
                this.getInitItemsObservable(false)
            )
            .zip(
                this.getInitSearchObservable()
            )
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.initialized = true;
            });
    }

    private getInitItemsObservable(appendItems: boolean): Observable<any> {
        if (this.config.onBeforeLoad) {
            this.config.onBeforeLoad(this.isInitialLoad);
        }

        // load first items
        return this.getLoadObservable(appendItems)
            .map(() => {
                if (this.config.onAfterLoad) {
                    this.config.onAfterLoad(this.isInitialLoad);
                }
                // set initial load flag
                this.isInitialLoad = false;
            });
    }

    private getLoadObservable(appendItems: boolean): Observable<void> {
        if (this.config.enableLocalLoader){
            this.localLoaderLoading = true;
        }

        if (this.config.loaderConfig){
            this.config.loaderConfig.start();
        }

        // prepare item query
        var query = this.config.loadQuery(this.searchTerm);

        // apply page size && page
        query.page(this.currentPage);
        query.pageSize(this.config.pageSize);

        return this.config.loadResolver(query)
            .takeUntil(this.ngUnsubscribe)
            .map(response => {
                this.currentPage++;
                this.totalPages = response.pages;

                if (!response.isEmpty()) {
                    if (appendItems){
                        this.items = _.union(this.items, response.items);
                    }
                    else{
                        this.items = response.items;
                    }
                }

                if (response.pages == response.page) {
                    this.showMoreButton = false;
                }
                else {
                    this.showMoreButton = true;
                }
                
                if (this.config.enableLocalLoader){
                    this.localLoaderLoading = false;
                }

                if (this.config.loaderConfig){
                    this.config.loaderConfig.stop();
                }
            }, (err) => {
                console.error(err);
            });
    }

    private getInitLoadMoreButtonObservable(): Observable<any> {
        this.loadMoreButtonSubject = new Subject<void>();

        return this.loadMoreButtonSubject
            .switchMap(event => {
                if (this.config.onBeforeLoad) {
                    this.config.onBeforeLoad(this.isInitialLoad);
                }
                return this.getLoadObservable(true);
            })
            .map(() => {
                if (this.config.onAfterLoad) {
                    this.config.onAfterLoad(this.isInitialLoad);
                }
                // set initial load flag
                this.isInitialLoad = false;
            });
    }

    private getItemTextField(): LoadMoreField<any> | null{
        if (this.config.text) {
            return this.config.text;
        }
        return null;
    }

    private getItemTitleField(): LoadMoreField<any> | null{
        if (this.config.title) {
            return this.config.title;
        }
        return null;
    }

    private getItemFooterField(): LoadMoreField<any> | null{
        if (this.config.footer) {
            return this.config.footer;
        }
        return null;
    }

    private getInitSearchObservable(): Observable<any> {
        return this.searchControl.valueChanges
            .debounceTime(this.searchDebounce)
            .map(text => {
                // reset page to 1 when searching
                this.currentPage = 1;
                this.searchTerm = text;
                
                // reload data
                this.getInitItemsObservable(false)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe();                
            });
    }
}