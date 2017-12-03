// common
import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';

// base
import { BaseWebComponent } from '../base-web-component.class';

// data table
import { DataTableComponent } from './data-table.component';

// material
import { MatSort, MatPaginator, Sort } from '@angular/material';

@Component({
    selector: 'data-table-pager',
    templateUrl: 'data-table-pager.component.html'
})
export class DataTablePagerComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() dataTable: DataTableComponent;

    private initialized: boolean = false;

    /**
     * Paginator is registered this way because it is under *ngIf
     */
    private _paginator: MatPaginator;
    @ViewChild(MatPaginator) set paginator(content: MatPaginator) {
        if (content) {
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
