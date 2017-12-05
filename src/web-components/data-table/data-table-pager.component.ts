// common
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';

import { BaseWebComponent } from '../base-web-component.class';
import { DataTableComponent } from './data-table.component';

@Component({
    selector: 'data-table-pager',
    templateUrl: 'data-table-pager.component.html'
})
export class DataTablePagerComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() dataTable: DataTableComponent;

    private initialized: boolean = false;

    private paginatorSubscribed: boolean = false;

    /**
     * Paginator is registered this way because it is under *ngIf
     */
    private _paginator: MatPaginator;
    @ViewChild(MatPaginator) set paginator(content: MatPaginator) {
        if (content && !this.paginatorSubscribed) {
            this._paginator = content;
            // subscribe to changes once sort is available 
            // this is here because the element is under *ngIf and therefore cannot be initilized immediately
            this.subscribeToPagerChanges();
        }
    }

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.initPager();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initPager();
    }

    private initPager(): void {
        if (this.initialized) {
            // pager was already initialized
            return;
        }

        this.initialized = true;
    }

    private subscribeToPagerChanges(): void {
        if (!this._paginator) {
            throw Error('Could not init paginator. Make sure the paginator is registered after its been initialized in template');
        }

        // make sure that no multiple subscriptions are registered
        this.paginatorSubscribed = true;

        // set translations
        this._paginator._intl.itemsPerPageLabel = '';

        this._paginator.page.map(pageChange => {
            this.dataTable.currentPage = pageChange.pageIndex + 1;
            this.dataTable.pageSize = pageChange.pageSize;

            this.dataTable.reloadData();
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }
}
