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
    @Input() hasNextPage: boolean;
    @Input() totalPages: number;
    @Input() pageSize: number;

    // events
    @Output() onSearch = new EventEmitter<string>();

    // variables
    private currentPage: number = 1;

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

    private onItemClick(item: any): void{
        var url = this.getItemUrl(item);

        this.router.navigate([url]);
    }
}