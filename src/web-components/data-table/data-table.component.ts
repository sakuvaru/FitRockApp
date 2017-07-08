// core
import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

// required by component
import { MultipleItemQuery } from '../../lib/repository';
import { DataTableField } from './data-table-field.class';
import { DataTableConfig, SelectableConfig, Filter } from './data-table.config';
import { AlignEnum } from './align-enum';
import { Observable, Subscription } from 'rxjs/Rx';
import { Guid } from '../../lib/utilities';
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

    // translated text
    private noItemsText: string;
    private searchNoItemsText: string;

    // filters
    private hasFilters: boolean = false;
    private activeFilterGuid: string;
    private filters: Filter<any>[] = [];

    // selectable
    private isSelectable: boolean = false;

    // clickable
    private isClickable: boolean = false;

    // pager
    private totalPages: number;
    private currentPage: number = 1;
    private showPagesCount = 5; // has to be an odd number
    private pagerButtons: PagerButton[];

    // search
    private searchTerm: string = null;

    // loader
    private loaderName: string = Guid.newGuid();

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
            //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
            this.translateService.get(this.config.noItemsTextKey).subscribe(text => this.noItemsText = text);
            this.translateService.get(this.config.searchNoItemsTextKey).subscribe(text => this.searchNoItemsText = text);

            // translated all labels
            this.config.fields.forEach(field => {
                this.translateService.get(field.label).subscribe(text => {
                    field.label = text;
                });
            });

            // init selectable
            this.isSelectable = this.config.isSelectable();

            // init clickable
            this.isClickable = this.config.isClickable();

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
                    query.pageSize(this.config.pagerSize);

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
                    this.items = response.items;
                    this.totalPages = response.pages;

                    // get pager buttons
                    this.pagerButtons = this.getPagerButtons();
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
            query.pageSize(this.config.pagerSize);

            // apply filter to query (filters are optional)
            query = this.getQueryWithFilters(query);

            this.config.loadResolver(query)
                .finally(() => {
                    if (this.config.onAfterLoad) {
                        this.config.onAfterLoad();
                    }
                })
                .subscribe(response => {
                    this.items = response.items;
                    this.totalPages = response.pages;

                    // get pager buttons
                    this.pagerButtons = this.getPagerButtons();
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

    // event emitters
    private handleSearch(searchTerm: string): void {
        // set search
        this.searchTerm = searchTerm;

        // reset pager
        this.currentPage = 1;

        // search items
        this.filterItems(this.currentPage);
    }

    // private methods
    private getTextAlignClass(field: DataTableField<any>): string {
        if (field.align === AlignEnum.Center) {
            return 'text-center';
        }
        else if (field.align === AlignEnum.Left) {
            return 'text-left';
        }
        else if (field.align === AlignEnum.Right) {
            return 'text-right';
        }

        return null;
    }

    private getFieldValue(field: DataTableField<any>, item: any): string {
        return field.value(item);
    }

    private isFirstItem(index: number): boolean {
        if (index === 0) {
            return true;
        }

        return false;
    }

    private getAvatarUrl(item: any): string {
        if (!this.config.avatarUrlResolver) {
            return null;
        }

        return this.config.avatarUrlResolver(item);
    }

    private getIcon(item: any): string {
        if (!this.config.iconResolver) {
            return null;
        }

        return this.config.iconResolver(item);
    }

    private onItemClick(item: any): void {
        if (!this.isClickable) {
            throw Error(`Cannot process item clicks because no callback is defined`);
        }

        this.config.onClick(item);
    }

    private onGoToPage(page: number): void {
        this.filterItems(page);
        this.currentPage = page;
    }

    private onGoToPreviousPage(): void {
        this.filterItems(this.currentPage - 1);
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    private onGoToNextPage(): void {
        this.filterItems(this.currentPage + 1);
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    private getPagerButtons(): PagerButton[] {
        var buttons: PagerButton[] = [];
        var buttonOffsetCount = (this.showPagesCount - 1) / 2;
        var startingPage: number;

        startingPage = this.currentPage - buttonOffsetCount;
        if (startingPage < 1) {
            // starting page has to be at least 1
            startingPage = 1;
        }
        else if (this.currentPage > this.totalPages - buttonOffsetCount) {
            // display more previous items if current page is approaching maximum number of pages
            var offset = this.currentPage - this.totalPages + this.showPagesCount - 1;
            var startingPage = this.currentPage - offset;

            // do not display negative pages
            if (startingPage < 1) {
                // show first page
                startingPage = 1;
            }
        }

        for (let i = startingPage; i < startingPage + this.showPagesCount; i++) {
            // do not exceed maximum page
            if (i > this.totalPages) {
                break;
            }

            var isActive = i == this.currentPage;
            buttons.push(new PagerButton(i, isActive));
        }

        return buttons;
    }

    private hasPreviousPage(): boolean {
        return this.currentPage > 1;
    }

    private hasNextPage(): boolean {
        return this.currentPage < this.totalPages;
    }

    private handleCheckboxChange(data: any, item: any): void {
        if (!this.config.isSelectable) {
            throw Error(`Cannot handle checkbox change events when data table is not selectable`);
        }

        var checked = data.checked;

        if (checked) {
            this.config.selectableConfig.onSelect(item);
        }
        else {
            this.config.selectableConfig.onDeselect(item);
        }
    }
}

class PagerButton {

    constructor(
        public page: number,
        public isActive: boolean
    ) { }
}