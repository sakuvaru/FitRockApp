// core
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// required by component
import { DataTableField } from './data-table-field.class';
import { DataTableConfig } from './data-table.config';
import { AlignEnum } from './align-enum';
import { TdLoadingService } from '@covalent/core';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent {
    // data
    @Input() items: any;
    @Input() fields: DataTableField<any>[];
    @Input() config: DataTableConfig<any>;

    // pager
    @Input() totalPages: number = 25;

    // events
    @Output() onSearch = new EventEmitter<string>();

    // variables
    private currentPage: number = 1;
    private showPagesCount = 5; // odd number

    constructor(
        private router: Router,
        private loadingService: TdLoadingService
    ) {
        this.loadingService.register('overlayStarSyntax');
    }

    // event emitters
    private handleSearch(searchTerm: string): void {
        this.onSearch.emit(searchTerm);
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
        this.config.pagerClick(page, this.config.pagerSize);
        this.currentPage = page;
    }

    private onGoToPreviousPage(): void {
        this.config.pagerClick(this.currentPage - 1, this.config.pagerSize);
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    private onGoToNextPage(): void {
        this.config.pagerClick(this.currentPage + 1, this.config.pagerSize);
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

        for (let i = startingPage; i < startingPage + this.showPagesCount; i++) {
            // do not exceed maximum page
            if (i > this.totalPages){
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