import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataTableField } from '../data-table-field.class';
import { DataTableConfig, Filter, PagerConfig, } from '../data-table.config';
import { AlignEnum } from '../align-enum';
import { Observable } from 'rxjs/Rx';
import { PagerButton } from './models';

@Component({
    selector: 'data-table-layout-pager',
    templateUrl: 'data-table-layout-pager.component.html'
})
export class DataTableLayoutPagerComponent implements OnInit, OnChanges {
    @Input() pagerConfig: PagerConfig;
    @Input() totalPages: number;
    @Input() currentPage = 1; // initial page

    @Output() goToPage = new EventEmitter<number>();

    private showPagesCount = 5; // has to be an odd number
    private pagerButtons: PagerButton[];

    ngOnInit() {
        this.initPagerButtons();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initPagerButtons();
    }

    private onGoToPage(page: number): void {
        this.currentPage = page;
        this.goToPage.emit(this.currentPage);

        this.initPagerButtons();
    }

    private onGoToPreviousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
        this.goToPage.emit(this.currentPage);

        this.initPagerButtons();
    }

    private onGoToNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
        this.goToPage.emit(this.currentPage);

        this.initPagerButtons();
    }

    private initPagerButtons(): void {
        const buttons: PagerButton[] = [];
        const buttonOffsetCount = (this.showPagesCount - 1) / 2;
        let startingPage: number;

        startingPage = this.currentPage - buttonOffsetCount;
        if (startingPage < 1) {
            // starting page has to be at least 1
            startingPage = 1;
        } else if (this.currentPage > this.totalPages - buttonOffsetCount) {
            // display more previous items if current page is approaching maximum number of pages
            const offset = this.currentPage - this.totalPages + this.showPagesCount - 1;
            startingPage = this.currentPage - offset;

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

            const isActive = i === this.currentPage;
            buttons.push(new PagerButton(i, isActive));
        }

        this.pagerButtons = buttons;
    }

    private hasPreviousPage(): boolean {
        return this.currentPage > 1;
    }

    private hasNextPage(): boolean {
        return this.currentPage < this.totalPages;
    }
}

@Component({
    selector: 'data-table-layout-header',
    templateUrl: 'data-table-layout-header.component.html'
})
export class DataTableLayoutHeaderComponent {
    @Input() config: DataTableConfig<any>;

    private getTextAlignClass(field: DataTableField<any>): string | null {
        if (field.align === AlignEnum.Center) {
            return 'text-center';
        } else if (field.align === AlignEnum.Left) {
            return 'text-left';
        } else if (field.align === AlignEnum.Right) {
            return 'text-right';
        }
        return null;
    }
}

@Component({
    selector: 'data-table-layout-search',
    templateUrl: 'data-table-layout-search.component.html'
})
export class DataTableLayoutSearchComponent implements OnInit {
    @Input() config: DataTableConfig<any>;
    @Input() searchTerm: string;

    @Output() search = new EventEmitter<string>();

    private readonly debounceTime = 300;
    private searchControl = new FormControl();

    ngOnInit() {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .subscribe(searchTerm => this.search.emit(searchTerm));
    }
}

@Component({
    selector: 'data-table-layout-filters',
    templateUrl: 'data-table-layout-filters.component.html'
})
export class DataTableLayoutFiltersComponent {

    @Input() activeFilterGuid: string;
    @Input() filters: Filter<any>[] = [];
    @Output() activateFilter = new EventEmitter<string>();

    private selectChip(filter: Filter<any>): void {
        this.activateFilter.emit(filter.guid);
    }
}

@Component({
    selector: 'data-table-layout-items',
    templateUrl: 'data-table-layout-items.component.html'
})
export class DataTableLayoutItemsComponent implements OnInit, OnChanges {
    @Input() config: DataTableConfig<any>;
    @Input() items: any[];
    @Input() localLoaderLoading: boolean = false;

    private isClickable: boolean;
    private isSelectable: boolean;

    ngOnInit() {
        this.initProperties();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initProperties();
    }

    initProperties(): void {
        // init selectable
        this.isSelectable = this.config.isSelectable();

        // init clickable
        this.isClickable = this.config.isClickable();
    }

    private translateValue(field: DataTableField<any>): boolean {
        if (field.translateValue) {
            return field.translateValue;
        }
        return false;
    }

    private getFieldValue(field: DataTableField<any>, item: any): string {
        return field.value(item);
    }

    private getAvatarUrl(item: any): string | null {
        if (!this.config.avatarUrlResolver) {
            return null;
        }

        return this.config.avatarUrlResolver(item);
    }

    private getIcon(item: any): string | null {
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

    private handleCheckboxChange(data: any, item: any): void {
        if (!this.config.isSelectable) {
            throw Error(`Cannot handle checkbox change events when data table is not selectable`);
        }

        const checked = data.checked;

        if (checked) {
            this.config.selectableConfig.onSelect(item);
        } else {
            this.config.selectableConfig.onDeselect(item);
        }
    }

    private getTextAlignClass(field: DataTableField<any>): string | null {
        if (field.align === AlignEnum.Center) {
            return 'text-center';
        } else if (field.align === AlignEnum.Left) {
            return 'text-left';
        } else if (field.align === AlignEnum.Right) {
            return 'text-right';
        }

        return null;
    }
}
