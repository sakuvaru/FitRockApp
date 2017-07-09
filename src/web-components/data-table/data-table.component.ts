import { Component, Input, Output, OnInit , OnChanges, SimpleChanges } from '@angular/core';
import { MultipleItemQuery } from '../../lib/repository';
import { DataTableConfig, Filter } from './data-table.config';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { TdMediaService } from '@covalent/core';
import * as _ from 'underscore';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent implements OnInit, OnChanges {

    // data table config
    @Input() config: DataTableConfig<any>;

    // resolved data
    private items: any[];

    // filters
    private hasFilters: boolean = false;
    private activeFilterGuid: string;
    private filters: Filter<any>[] = [];

    // pager
    private totalPages: number;
    private currentPage: number = 1;

    // search
    private searchTerm: string = null;

    constructor(
        private translateService: TranslateService,
        private mediaService: TdMediaService,
    ) {
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
            // translated all labels
            this.config.fields.forEach(field => {
                this.translateService.get(field.label).subscribe(text => {
                    field.label = text;
                });
            });

            // load items
            this.filterItems(1);
        }
    }

    // load methods
    private filterItems(page: number): void {
        if (this.config.onBeforeLoad) {
            this.config.onBeforeLoad();
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
                        var sumCount = _.reduce(this.filters, (memo, filter) => memo + filter.count, 0);
                        var allFilter = new Filter({ onFilter: () => query, count: sumCount, filterNameKey: 'All' });

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
                        this.config.onAfterLoad();
                    }
                })
                .subscribe(response => {
                    this.currentPage = page;
                    this.items = response.items;
                    this.totalPages = response.pages;
                });
        }
        else {
            var query = this.config.loadQuery(this.searchTerm);

            // add static filters
            this.filters = [];

            // add static filters first
            if (this.config.staticFilters && this.config.staticFilters.length > 0) {
                this.config.staticFilters.forEach(staticFilter => this.filters.push(staticFilter));
            }

            // add all filter
            if (this.config.showAllFilter) {
                // get sum count of all filter's count
                var sumCount = _.reduce(this.filters, (memo, filter) => memo + filter.count, 0);
                var allFilter = new Filter({ onFilter: () => query, count: sumCount, filterNameKey: 'All' });

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
                .finally(() => {
                    if (this.config.onAfterLoad) {
                        this.config.onAfterLoad();
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

        // filter items
        this.filterItems(1);
    }

    private getFilterByGuid(guid: string): Filter<any> {
        return this.filters.find(m => m.guid === guid);
    }

    private getQueryWithFilters(query: MultipleItemQuery<any>): MultipleItemQuery<any> {
        if (this.hasFilters) {
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

        // search items
        this.filterItems(1);
    }
}
