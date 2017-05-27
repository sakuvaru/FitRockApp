// core
import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// required by component
import { DataTableField } from './data-table-field.class';
import { DataTableConfig } from './data-table.config';
import { AlignEnum } from './align-enum';
import { Observable } from 'rxjs/Observable';
import { Guid } from '../../../utilities/general.class';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent implements AfterViewInit {

    // resolved data
    private items: any[];

    // base config
    @Input() fields: DataTableField<any>[];
    @Input() config: DataTableConfig<any>;

    // events
    @Output() onSearch = new EventEmitter<string>();

    // pager
    private totalPages: number;
    private currentPage: number = 1;
    private showPagesCount = 5; // odd number

    // search
    private searchTerm: string = null;

    // loader
    private loaderEnabled: boolean = true;
    private loaderName: string = Guid.newGuid();

    constructor(
        private router: Router,
    ) {
    }

    ngAfterViewInit() {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        this.filterItems(1);
    }

    // load methods
    private filterItems(page: number): void {
        // register loader on page change
        if (!this.loaderEnabled) {
            this.loaderEnabled = true;
        }

        this.config.loadItems(this.searchTerm, page, this.config.pagerSize).subscribe(response => {
            this.items = response.items;
            this.totalPages = response.pages;
            this.loaderEnabled = false;
            console.log(response);
        });
    }

    // event emitters
    private handleSearch(searchTerm: string): void {
        // set search
        this.searchTerm = searchTerm;

        this.onSearch.emit(searchTerm);

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

    private isLinkItem(): boolean {
        return this.config.url != null
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

    private getItemUrl(item: any): string {
        if (!this.isLinkItem()) {
            return null;
        }

        return this.config.url(item);
    }

    private getAvatarUrl(item: any): string {
        if (!this.config.avatarUrl) {
            return null;
        }

        return this.config.avatarUrl(item);
    }

    private getIcon(item: any): string {
        if (!this.config.icon) {
            return null;
        }

        return this.config.icon(item);
    }

    private onItemClick(item: any): void {
        var url = this.getItemUrl(item);

        this.router.navigate([url]);
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
}

class PagerButton {

    constructor(
        public page: number,
        public isActive: boolean
    ) { }
}