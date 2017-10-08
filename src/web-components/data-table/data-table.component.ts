import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MultipleItemQuery } from '../../lib/repository';
import { DataTableConfig, Filter } from './data-table.config';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { TdMediaService } from '@covalent/core';
import { BaseWebComponent } from '../base-web-component.class';
import { DataTableLayoutSearchComponent } from './layouts/layouts.components';
import * as _ from 'underscore';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent extends BaseWebComponent implements OnInit, OnChanges {

    // search component
    @ViewChild(DataTableLayoutSearchComponent) searchInput: DataTableLayoutSearchComponent;

    // data table config
    @Input() config: DataTableConfig<any>;

    // hash of current data table config
    private configHash: number;

    // resolved data
    private items: any[] = [];

    // filters
    private hasFilters = false;
    private activeFilterGuid: string | null;
    private filters: Filter<any>[] = [];

    // pager
    private totalPages: number;
    private currentPage = 1;

    // local storage suffixes
    private localStorageActiveFilter = 'data_table_active_filter';
    private localStoragePage = 'data_table_page';
    private localStorageSearchedData = 'data_table_searchedData';

    // keys
    private allFilterKey = 'webComponents.dataTable.allFilterText';

    // search
    private searchTerm = '';

    // local loader
    private localLoaderLoading = false;

    /**
     * Indicates if the load of items is the initial load
     */
    private isInitialLoad = true;

    /**
    * Flag for initialization component, used because ngOngChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    private initialized = false;

    constructor(
        private translateService: TranslateService,
        private mediaService: TdMediaService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.config) {
            this.initDataTable();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            // set config after changes
            this.config = changes.config.currentValue;

            // reinit data table
            this.initDataTable();
        }
    }

    reloadData(): void {
        this.initialized = false;
        this.initDataTable();
    }

    /**
     * Reloads data table
     * @param config Data table config
     */
    forceReinitialization(config: DataTableConfig<any>): void {
        this.initialized = false;
        this.initDataTable();
    }

    private initDataTable(): void {
        if (this.config && !this.initialized) {
            // translate all labels (which have 'labelKey' set)
            this.config.fields.forEach(field => {
                if (field.labelKey) {
                    this.translateService.get(field.labelKey).subscribe(text => {
                        field.labelKey = text;
                    });
                }
            });

            // init hash
            this.configHash = this.config.getHash();

            // init last filters state
            if (this.config.saveLastFilter) {
                this.initLastFilterState(this.configHash);
            }

            // load items
            this.filterItems(this.currentPage);

            // set component as initialized
            this.initialized = true;
        }
    }

    // load methods
    private filterItems(page: number): void {
        // save page to local storage
        this.savePageToLocalStorage(this.configHash, page);

        // enable local loader
        if (this.config.enableLocalLoader) {
            this.localLoaderLoading = true;
        }

        if (this.config.loaderConfig) {
            this.config.loaderConfig.start();
        }

        if (this.config.onBeforeLoad) {
            this.config.onBeforeLoad(this.isInitialLoad);
        }

        if (this.config.dynamicFilters) {
            this.config.dynamicFilters(this.searchTerm)
                .takeUntil(this.ngUnsubscribe)
                .switchMap((dynamicFilters) => {
                    // reset filters so that they are not added multiple times across requests
                    this.filters = [];

                    // add static filters first
                    if (this.config.staticFilters && this.config.staticFilters.length > 0) {
                        this.config.staticFilters.forEach(staticFilter => this.filters.push(staticFilter));
                    }

                    // add dynamic filters
                    if (dynamicFilters && dynamicFilters.length > 0) {
                        dynamicFilters.forEach(dynamicFilter => this.filters.push(dynamicFilter));
                    }

                    // add all filter
                    if (this.config.showAllFilter) {
                        // get sum count of all filter's count
                        const sumCount = _.reduce(this.filters, (memo, filter) => filter.count != null ? memo + filter.count : memo, 0);
                        const allFilter = new Filter({
                            onFilter: () => query,
                            count: sumCount,
                            filterNameKey: this.allFilterKey
                        });

                        // add all filter at the beginning of filters array
                        this.filters = [allFilter, ...this.filters];
                    }

                    // set filters flag
                    if (this.filters && this.filters.length > 0) {
                        this.hasFilters = true;
                    } else {
                        this.hasFilters = false;
                    }

                    // prepare item query
                    let query = this.config.loadQuery(this.searchTerm);

                    // automatically apply page size + page options
                    query.page(page);
                    query.pageSize(this.config.pagerConfig.pagerSize);

                    // apply filter to query (filters are optional)
                    query = this.getQueryWithFilters(query);

                    return this.config.loadResolver(query);
                })
                .finally(() => {
                    if (this.config.onAfterLoad) {
                        this.config.onAfterLoad(this.isInitialLoad);
                    }
                    if (this.config.loaderConfig) {
                        this.config.loaderConfig.stop();
                    }
                    // set initial load flag
                    this.isInitialLoad = false;

                    // finish local loader
                    if (this.config.enableLocalLoader) {
                        this.localLoaderLoading = false;
                    }

                })
                .subscribe(response => {
                    this.currentPage = page;
                    this.items = response.items;
                    this.totalPages = response.pages;
                });
        } else {
            let query = this.config.loadQuery(this.searchTerm);

            // prepare static filters
            this.filters = [];

            // add static filters
            if (this.config.staticFilters && this.config.staticFilters.length > 0) {
                this.config.staticFilters.forEach(staticFilter => this.filters.push(staticFilter));
            }

            // add all filter
            if (this.config.showAllFilter) {
                const allFilter = new Filter({
                    onFilter: (onFilterQuery) => query,
                    filterNameKey: this.allFilterKey,
                });

                // add all filter at the beginning of filters array
                this.filters = [allFilter, ...this.filters];
            }

            // set filters flag
            if (this.filters && this.filters.length > 0) {
                this.hasFilters = true;
            } else {
                this.hasFilters = false;
            }

            // automatically apply page size + page options
            query.page(page);
            query.pageSize(this.config.pagerConfig.pagerSize);

            // apply filter to query (filters are optional)
            query = this.getQueryWithFilters(query);

            this.config.loadResolver(query)
                .takeUntil(this.ngUnsubscribe)
                .finally(() => {
                    if (this.config.onAfterLoad) {
                        this.config.onAfterLoad(this.isInitialLoad);
                    }

                    if (this.config.loaderConfig) {
                        this.config.loaderConfig.stop();
                    }
                    // update initial load flag
                    this.isInitialLoad = false;

                    // finish local loader
                    if (this.config.enableLocalLoader) {
                        this.localLoaderLoading = false;
                    }

                })
                .subscribe(response => {
                    this.currentPage = page;
                    this.items = response.items;
                    this.totalPages = response.pages;
                });
        }
    }

    private applyFilter(filterGuid: string) {
        // set active filter
        this.activeFilterGuid = filterGuid;

        // save filter to local storage
        this.saveFilterToLocalStorage(this.configHash, filterGuid);
        this.savePageToLocalStorage(this.configHash, 1);

        // filter items
        this.filterItems(1);
    }

    private getFilterByGuid(guid: string): Filter<any> | undefined {
        const filter = this.filters.find(m => m.guid === guid);
        return filter;
    }

    private getQueryWithFilters(query: MultipleItemQuery<any>): MultipleItemQuery<any> {
        if (this.hasFilters) {
            let filter: Filter<any> | undefined;

            // try getting the active filter
            if (this.activeFilterGuid) {
                filter = this.getFilterByGuid(this.activeFilterGuid);
            }

            if (!filter) {
                 // if no active filter is found or the filter is invalid, use the first one
                filter = this.filters[0];
                this.activeFilterGuid = filter.guid;
            }

            if (!filter) {
                throw Error(`Data table filter failed due to invalid filter.`);
            }

            query = filter.onFilter(query);
        }
        return query;
    }

    // search
    private handleSearch(searchTerm: string): void {
        // set search
        this.searchTerm = searchTerm;

        // save search term to local storage
        this.saveSearchedDataToLocalStorage(this.configHash, searchTerm);

        // search items
        this.filterItems(1);
    }

    // local storage & last state
    private saveCurrentFilters(hash: number): void {
        this.saveFilterToLocalStorage(hash, this.activeFilterGuid || '');
        this.savePageToLocalStorage(hash, this.currentPage);
        this.saveSearchedDataToLocalStorage(hash, this.searchTerm);
    }

    private initLastFilterState(hash: number): void {
        const filterFormStorage = this.getFilterFromLocalStorage(hash);
        const pageFromStorage = this.getPageFromLocalStorage(hash);
        const searchTermFromStorage = this.getSearchedDataFromLocalStorage(hash);

        if (filterFormStorage) {
            this.activeFilterGuid = filterFormStorage;
        }

        if (pageFromStorage) {
            this.currentPage = pageFromStorage;
        }

        if (searchTermFromStorage) {
            this.searchTerm = searchTermFromStorage;
        }
    }

    private getFilterFromLocalStorage(hash: number): string | null {
        return localStorage.getItem(this.localStorageActiveFilter + '_' + hash);
    }

    private getPageFromLocalStorage(hash: number): number | null {
        const page = localStorage.getItem(this.localStoragePage + '_' + hash);

        if (!page) {
            // use first page if none is was set
            return 1;
        }

        return +page;
    }

    private getSearchedDataFromLocalStorage(hash: number): string | null {
        return localStorage.getItem(this.localStorageSearchedData + '_' + hash);
    }

    private saveFilterToLocalStorage(hash: number, filterGuid: string) {
        localStorage.setItem(this.localStorageActiveFilter + '_' + hash, filterGuid);
    }

    private savePageToLocalStorage(hash: number, page: number) {
        localStorage.setItem(this.localStoragePage + '_' + hash, page.toString());
    }

    private saveSearchedDataToLocalStorage(hash: number, search: string) {
        localStorage.setItem(this.localStorageSearchedData + '_' + hash, search);
    }

}

class FilterTemp {
    constructor(
        public count: number,
        public filterKey: string
    ) { }
}

