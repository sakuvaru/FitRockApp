import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataListField } from '../data-list-field.class';
import { DataListConfig, Filter, PagerConfig, } from '../data-list.config';
import { AlignEnum } from '../align-enum';
import { Observable } from 'rxjs/Rx';
import { PagerButton } from './models';
import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'data-list-layout-pager',
    templateUrl: 'data-list-layout-pager.component.html'
})
export class DataListLayoutPagerComponent implements OnInit, OnChanges {
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
    selector: 'data-list-layout-header',
    templateUrl: 'data-list-layout-header.component.html'
})
export class DataListLayoutHeaderComponent {
    @Input() config: DataListConfig<any>;

    private getTextAlignClass(field: DataListField<any>): string | null {
        if (field.align === AlignEnum.Center) {
            return 'text-center';
        } else if (field.align === AlignEnum.Left) {
            return 'text-left';
        } else if (field.align === AlignEnum.Right) {
            return 'text-right';
        }
        return null;
    }

    private isObservable(field: DataListField<any>): boolean {
        return field.label instanceof Observable;
    }
}

@Component({
    selector: 'data-list-layout-search',
    templateUrl: 'data-list-layout-search.component.html'
})
export class DataListLayoutSearchComponent implements OnInit {
    @Input() config: DataListConfig<any>;
    @Input() searchTerm: string;

    @Output() search = new EventEmitter<string>();

    private readonly debounceTime = 500;
    private searchControl = new FormControl();

    ngOnInit() {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .subscribe(searchTerm => this.search.emit(searchTerm));
    }
}

@Component({
    selector: 'data-list-layout-filters',
    templateUrl: 'data-list-layout-filters.component.html'
})
export class DataListLayoutFiltersComponent {

    @Input() activeFilterGuid: string;
    @Input() filters: Filter<any>[] = [];
    @Output() activateFilter = new EventEmitter<string>();

    private selectChip(filter: Filter<any>): void {
        this.activateFilter.emit(filter.guid);
    }
}


@Component({
    selector: 'data-list-layout-field',
    templateUrl: 'data-list-layout-field.component.html'
})
export class DataListLayoutFieldComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() item: any;
    @Input() field: DataListField<any>;

    public fieldValue: string;

    ngOnInit(): void {
       this.initField(this.item, this.field);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initField(this.item, this.field);
    }

    private initField(item: any, field: DataListField<any>): void {
        if (!this.fieldValue && item && field) {
            const valueFunc = field.value(item);
            if (valueFunc instanceof Observable) {
                valueFunc.takeUntil(this.ngUnsubscribe)
                    .map(value => this.fieldValue = value)
                    .subscribe();
            } else {
                this.fieldValue = field.value(item) as string;
            }
        }
    }
}

@Component({
    selector: 'data-list-layout-items',
    templateUrl: 'data-list-layout-items.component.html'
})
export class DataListLayoutItemsComponent implements OnInit, OnChanges {
    @Input() config: DataListConfig<any>;
    @Input() items: any[];
    @Input() localLoaderLoading: boolean = false;

    public isClickable: boolean;
    public isSelectable: boolean;

    public fieldValue: string;

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
        if (!this.isClickable || !this.config.onClick) {
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

    private getTextAlignClass(field: DataListField<any>): string | null {
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
