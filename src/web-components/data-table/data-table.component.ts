import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MultipleItemQuery, ErrorResponse } from '../../lib/repository';
import { observableHelper } from '../../lib/utilities';
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
    private allFilter: Filter<any> | undefined;

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

        // update current page
        this.currentPage = page;

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
                    // add dynamic filters
                    this.resolveDynamicFilters(dynamicFilters);

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
                    this.items = response.items;
                    this.totalPages = response.pages;
                },
                err => this.handleLoadError(this.config, err));
        } else {
            // add & resolve static filters
            this.resolveStaticFilters();

            // prepare query
            let query = this.config.loadQuery(this.searchTerm);

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
                    this.items = response.items;
                    this.totalPages = response.pages;
                },
                err => this.handleLoadError(this.config, err));
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

    private resolveDynamicFilters(dynamicFilters: Filter<any>[]): void {
        this.prepareFilters();

        let sumCount = 0;

        if (dynamicFilters && dynamicFilters.length > 0) {
            dynamicFilters.forEach(dynamicFilter => {

                this.filters.push(dynamicFilter);
                if (dynamicFilter.count) {
                    sumCount += dynamicFilter.count;
                }
            });

            if (this.allFilter) {
                this.allFilter.count = sumCount;
            }
        }

        this.resolveCommonFilterLogic();
    }

    private resolveStaticFilters(): void {
        this.prepareFilters();

        if (this.config.staticFilters && this.config.staticFilters.length > 0) {

            // prepare observable for all filters
            const staticFilterCountObservables: Observable<any>[] = [];

            this.config.staticFilters.forEach(staticFilter => {

                // prepare filter query
                let filterQuery = this.config.loadQuery(this.searchTerm);
                
                        // apply page and page size
                        filterQuery = filterQuery.page(this.currentPage);
                        filterQuery.pageSize(this.config.pagerConfig.pagerSize);

                filterQuery = staticFilter.onFilter(filterQuery);
                
                this.filters.push(staticFilter);
                // use count query to get the number of records of given filter
                if (staticFilter.countQuery) {
                    staticFilterCountObservables.push(staticFilter.countQuery(filterQuery).get()
                        .map(responseCount => staticFilter.count = responseCount.count));
                }
            });

            // resolve static filters count
            observableHelper.zipObservables(staticFilterCountObservables)
                .map(() => {
                    // update count of all filter if its present
                    if (this.allFilter) {
                        // go through all filters and sum up the count
                        let sumCount = 0;
                        this.filters.forEach(filter => {
                            if (filter.count) {
                                sumCount += filter.count;
                            }
                        });

                        // if the all filter is used and has count > 0, subtract it from the total sum
                        if (this.allFilter.count && this.allFilter.count > 0) {
                            sumCount -= this.allFilter.count;
                        }

                        // update total count
                        this.allFilter.count = sumCount;
                    }
                })
                .takeUntil(this.ngUnsubscribe)
                .subscribe();
        }

        this.resolveCommonFilterLogic();
    }

    private prepareFilters(): void {
        this.filters = [];

        const allFilterQuery = (onFilterQuery) => this.config.loadQuery(this.searchTerm).page(this.currentPage).pageSize(this.config.pagerConfig.pagerSize);
        // add all filter
        if (this.config.showAllFilter) {
            if (this.allFilter) {
                  // update query with current data
                  this.allFilter.onFilter = allFilterQuery;

            } else {
                this.allFilter = new Filter({
                    onFilter: allFilterQuery,
                    filterNameKey: this.allFilterKey,
                });
            }

            // add existing all filter if available (prevents flickering)
            this.filters.push(this.allFilter);
        }
    }

    private resolveCommonFilterLogic(): void {
        // set filters flag
        if (this.filters && this.filters.length > 0) {
            this.hasFilters = true;
        } else {
            this.hasFilters = false;
        }

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

    private handleLoadError(config: DataTableConfig<any>, errorResponse: ErrorResponse | any): void {
        if (this.config.onError) {
            this.config.onError(errorResponse);
        }
    }

}

class FilterTemp {
    constructor(
        public count: number,
        public filterKey: string
    ) { }
}

