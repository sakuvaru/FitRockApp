import { Component, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MultipleItemQuery } from '../../lib/repository';
import { DataTableConfig, Filter } from './data-table.config';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { TdMediaService } from '@covalent/core';
import { BaseWebComponent } from '../base-web-component.class';
import * as _ from 'underscore';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent extends BaseWebComponent implements OnInit, OnChanges {

    // data table config
    @Input() config: DataTableConfig<any>;

    // hash of current data table config
    private configHash: number;

    // resolved data
    private items: any[];

    // filters
    private hasFilters: boolean = false;
    private activeFilterGuid: string | null;
    private filters: Filter<any>[] = [];

    // pager
    private totalPages: number;
    private currentPage: number = 1;

    // local storage suffixes
    private localStorageActiveFilter: string = 'data_table_active_filter';
    private localStoragePage: string = 'data_table_page';
    private localStorageSearchedData: string = 'data_table_searchedData';

    // keys
    private allFilterKey: string = 'webComponents.dataTable.allFilterText';

    // search
    private searchTerm: string = '';

    /**
     * Indicates if the load of items is the initial load
     */
    private isInitialLoad: boolean = true;

    constructor(
        private translateService: TranslateService,
        private mediaService: TdMediaService,
    ) {
        super()
    }

    ngOnInit() {
        this.initDataTable();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {

            // set config after changes
            this.config = changes.config.currentValue;

            // reinit data table
            this.initDataTable();
        }
    }

    private initDataTable(): void {
        if (this.config) {
            // translate all labels (which have 'labelKey' set)
            this.config.fields.forEach(field => {
                if (field.labelKey){
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
        }
    }

    // load methods
    private filterItems(page: number): void {
        // save page to local storage
        this.savePageToLocalStorage(this.configHash, page);

        if (this.config.loaderConfig){
            this.config.loaderConfig.start();
        }

        if (this.config.onBeforeLoad) {
            this.config.onBeforeLoad(this.isInitialLoad);
        }

        if (this.config.dynamicFilters) {
            this.config.dynamicFilters(this.searchTerm)
                .flatMap((dynamicFilters) => {
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
                        var sumCount = _.reduce(this.filters, (memo, filter) => filter.count != null ? memo + filter.count : memo, 0);
                        var allFilter = new Filter({
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
                    }
                    else {
                        this.hasFilters = false;
                    }

                    // prepare item query
                    var query = this.config.loadQuery(this.searchTerm);

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
                    if (this.config.loaderConfig){
                        this.config.loaderConfig.stop();
                    }
                    // set initial load flag
                    this.isInitialLoad = false;
                })
                .takeUntil(this.ngUnsubscribe)
                .subscribe(response => {
                    this.currentPage = page;
                    this.items = response.items;
                    this.totalPages = response.pages;
                });
        }
        else {
            var query = this.config.loadQuery(this.searchTerm);

            // prepare static filters
            this.filters = [];

            // add static filters 
            if (this.config.staticFilters && this.config.staticFilters.length > 0) {
                this.config.staticFilters.forEach(staticFilter => this.filters.push(staticFilter));
            }

            // add all filter
            if (this.config.showAllFilter) {
                var allFilter = new Filter({
                    onFilter: (query) => query,
                    filterNameKey: this.allFilterKey,
                });

                // add all filter at the beginning of filters array
                this.filters = [allFilter, ...this.filters];
            }

            // set filters flag
            if (this.filters && this.filters.length > 0) {
                this.hasFilters = true;
            }
            else {
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

                    if (this.config.loaderConfig){
                        this.config.loaderConfig.stop();
                    }
                    // update initial load flag
                    this.isInitialLoad = false;
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

    /*Temp filters
   private calculateStaticFilters(): void {
       if (this.filters) {
           var resolvedFilters = 0;
           var allFilters = this.config.showAllFilter ? this.filters.length - 1 : this.filters;
           var tempFilters: FilterTemp[] = [];

           // resolve static filter's count
           this.filters.forEach(filter => {
               if (filter.countQuery && filter.onFilter) {
                   // filter has defined a query to get the data
                   filter.onFilter(this.config.loadQuery(this.searchTerm)).toCountQuery()
                       .get()
                       .takeUntil(this.ngUnsubscribe)
                       .subscribe(result => {
                           resolvedFilters++;
                           tempFilters.push(new FilterTemp(result.count, filter.filterNameKey));

                           // set count for all filters all at once
                           if (resolvedFilters === allFilters) {
                               this.updateFiltersFromTemp(tempFilters);
                           }
                       });
               }
           });
       }
   }

   private updateFiltersFromTemp(tempFilters: FilterTemp[]): void{
       var sumCount = 0;

       tempFilters.forEach(tempFilter => {
           var filter = this.filters.find(m => m.filterNameKey === tempFilter.filterKey);
           if (!filter){
               throw Error(`Filter '${tempFilter.filterKey}' was not found`);
           }
           sumCount += tempFilter.count;
           filter.count = tempFilter.count;
       });

       // set all filter
       if (this.config.showAllFilter){
           var allFilter = this.filters.find(m => m.filterNameKey === this.allFilterKey);
           allFilter.count = sumCount;
       }
   }
   */

    private getFilterByGuid(guid: string): Filter<any> | undefined{
        var filter = this.filters.find(m => m.guid === guid);
        return filter;
    }

    private getQueryWithFilters(query: MultipleItemQuery<any>): MultipleItemQuery<any> {
        if (this.hasFilters && this.activeFilterGuid) {
            var filter = this.getFilterByGuid(this.activeFilterGuid);

            // if not filter is found, use the first one
            if (!filter) {
                filter = this.filters[0];
                this.activeFilterGuid = filter.guid;
            }

            if (filter) {
                query = filter.onFilter(query);
            }
            // do not throw exception is filter is not found - if item's result contain 0 items, there could be 0 filters
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
        var filterFormStorage = this.getFilterFromLocalStorage(hash);
        var pageFromStorage = this.getPageFromLocalStorage(hash);
        var searchTermFromStorage = this.getSearchedDataFromLocalStorage(hash);

        if (filterFormStorage){
            this.activeFilterGuid = filterFormStorage;
        }

        if (pageFromStorage){
            this.currentPage = pageFromStorage;
        }

        if (searchTermFromStorage){
            this.searchTerm = searchTermFromStorage;
        }
    }

    private getFilterFromLocalStorage(hash: number): string | null{
        return localStorage.getItem(this.localStorageActiveFilter + '_' + hash);
    }

    private getPageFromLocalStorage(hash: number): number | null {
        var page = localStorage.getItem(this.localStoragePage + '_' + hash);

        if (!page) {
            // use first page if none is was set
            return 1;
        }

        return +page;
    }

    private getSearchedDataFromLocalStorage(hash: number): string | null{
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

