// core
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

// required by component
import { DataTableField } from './data-table-field.class';
import { DataTableConfig } from './data-table.config';
import { AlignEnum } from './align-enum';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent {
    @Input() items: any;
    @Input() fields: DataTableField<any>[];
    @Input() config: DataTableConfig<any>;

    @Output() onSearch = new EventEmitter<string>();

    constructor() {
    }

    // event emitters
    private handleSearch(searchTerm: string): void{
        console.log(searchTerm);
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
}