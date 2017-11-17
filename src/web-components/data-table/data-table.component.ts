// common
import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';
import { DataSource } from '@angular/cdk/collections';
import { guidHelper } from '../../lib/utilities';
import { FormControl } from '@angular/forms';

import { DataTableConfig } from './data-table.config';
import { DataTableSource } from './data-table-source.class';
import { DataTableField, DataTableFieldWrapper } from './data-table-models';

import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() config: DataTableConfig;

    /**
     * Indicates if loader is enabled
     */
    private loaderEnabled: boolean = false;

    /**
     * Displayed columns
     */
    get displayedColumns(): string[] {
        return this.fieldsWrapper.map(m => m.nameDef);
    }

    /**
     * Limit
     */
    private limit: number = 0;

    /**
     * Page size
     */
    private pageSize: number = 20;

    /**
     * Total number of items in db
     */
    private totalItems: number = 0;

    /**
     * Index of current page
     */
    private currentPage: number = 1;

    /**
     * Paginator indexes pages from 0
     */
    get paginatorPageIndex(): number {
        return this.currentPage - 1;
    }

    /**
     * Searched string
     */
    private search: string = '';

    /**
     * Fields wrapper
     */
    private fieldsWrapper: DataTableFieldWrapper[] = [];

    /**
     * Data source
     */
    private dataSource?: DataSource<any>;

    /**
    * Flag for initialization component, used because ngOngChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    private initialized = false;

    private readonly debounceTime = 500;
    private searchControl = new FormControl();

    /** 
     * Filter
     */
    @ViewChild('filter') filter: ElementRef;

    /**
     * Paginator
     */
    @ViewChild('paginator') paginator: MatPaginator;

    constructor(
    ) { super(); }

    ngOnInit() {
        this.initDataTable(this.config);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initDataTable(this.config);
    }

    /**
     * inits data table
     */
    initDataTable(config: DataTableConfig): void {
        if (!this.config) {
            return;
        }

        // start up loader
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }

        // map displayed columns
        this.fieldsWrapper = this.config.fields.map(field => {
            return new DataTableFieldWrapper(field, guidHelper.newGuid());
        });

        // init properties
        this.pageSize = this.config.pageSize;
        this.limit = this.config.limit;
        this.currentPage = this.config.page;

        // subscribe to filter
        this.subscribeToFilterChanges();

        // subscribe to pager changes
        this.subscribeToPagerChanges();

        // load actual data
        this.loadData(this.pageSize, this.currentPage, this.search, this.limit);

        this.initialized = true;
    }

    private subscribeToFilterChanges(): void {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(searchTerm => {
                this.search = searchTerm;
                this.loadData(this.pageSize, this.currentPage, this.search, this.limit);
            });
    }

    private subscribeToPagerChanges(): void {
        if (!this.paginator) {
            console.log('Could not init paginator');
            return;
        }

        // set translations
        this.paginator._intl.itemsPerPageLabel = '';

        this.paginator.page.map(pageChange => {
            this.currentPage = pageChange.pageIndex + 1;
            this.pageSize = pageChange.pageSize;

            this.loadData(this.pageSize, this.currentPage, this.search, this.limit);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private loadData(pageSize, page, search, limit): void {
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }

        // get Observable used to load data
        const dataObs = this.config.getData(pageSize, page, search, limit);

        dataObs.map(response => {
            this.totalItems = response.totaltems;
            this.dataSource = new DataTableSource(response.items);

            if (this.config.enableLocalLoader) {
                this.loaderEnabled = false;
            }
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    /**
     * Reloads data
     */
    reloadData(): void {
    }



}



