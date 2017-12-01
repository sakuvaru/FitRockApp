import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseMultipleItemQuery, ErrorResponse, ItemCountQuery } from '../../lib/repository';
import { observableHelper } from '../../lib/utilities';
import { DataListConfig, Filter } from './data-list.config';
import { Observable } from 'rxjs/Rx';
import { LocalizationService } from '../../lib/localization';
import { TdMediaService } from '@covalent/core';
import { BaseWebComponent } from '../base-web-component.class';
import { DataListLayoutSearchComponent } from './layouts/layouts.components';
import * as _ from 'underscore';

@Component({
    selector: 'data-list',
    templateUrl: 'data-list.component.html'
})
export class DataListComponent extends BaseWebComponent implements OnInit, OnChanges {

    // search component
    @ViewChild(DataListLayoutSearchComponent) searchInput: DataListLayoutSearchComponent;

    // data list config
    @Input() config: DataListConfig<any>;

    // hash of current data list config
    public configHash: number;

    // resolved data
    private items: any[] = [];

    // filters
    private hasFilters = false;
    private activeFilterGuid: string | null;
    private filters: Filter<BaseMultipleItemQuery>[] = [];
    private allFilter: Filter<BaseMultipleItemQuery> | undefined;

    // pager
    private totalPages: number;
    private currentPage = 1;

    // local storage suffixes
    private localStorageActiveFilter = 'data_list_active_filter';
    private localStoragePage = 'data_list_page';
    private localStorageSearchedData = 'data_list_searchedData';

    // keys
    private allFilterKey = 'webComponents.dataList.allFilterText';

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
    public initialized = false;

    constructor(
        private localizationService: LocalizationService,
        private mediaService: TdMediaService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.config) {
            this.init();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            // set config after changes
            this.config = changes.config.currentValue;

            // reinit
            this.init();
        }
    }

    reloadData(): void {
        this.initialized = false;
        this.init();
    }

    /**
     * Reloads data list
     * @param config Data list config
     */
    forceReinitialization(config: DataListConfig<any>): void {
        this.initialized = false;
        this.init();
    }

    private init(): void {
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

                    return query.get();
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
                .takeUntil(this.ngUnsubscribe)
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

            query.get()
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
                .takeUntil(this.ngUnsubscribe)
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

    private getQueryWithFilters(query: BaseMultipleItemQuery): BaseMultipleItemQuery {
        if (this.hasFilters) {
            let filter: Filter<BaseMultipleItemQuery> | undefined;

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
                throw Error(`Data list filter failed due to invalid filter.`);
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
        if (!this.config.staticFilters || this.config.staticFilters.length === 0) {
            return;
        }

        this.prepareFilters();


        // prepare observable for all filters
        const staticFilterCountObservables: Observable<any>[] = [];

        this.config.staticFilters.forEach(staticFilter => {

            // prepare filter query
            let filterQuery = this.config.loadQuery(this.searchTerm);

            // apply page and page size
            filterQuery = filterQuery.page(this.currentPage);
            filterQuery.pageSize(this.config.pagerConfig.pagerSize);

            filterQuery = staticFilter.onFilter(filterQuery);

            // prepare count query
            const filterCountQuery: ItemCountQuery = staticFilter.countQuery ? staticFilter.countQuery(filterQuery) : filterQuery.toCountQuery();

            this.filters.push(staticFilter);
            // use count query to get the number of records of given filter
            staticFilterCountObservables.push(filterCountQuery.get()
                .map(responseCount => staticFilter.count = responseCount.count));
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

    public handleLoadError(config: DataListConfig<any>, errorResponse: ErrorResponse | any): void {
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

