import { Observable } from 'rxjs/Rx';
import { DataTableSortEnum } from './data-table-sort.enum';
import { DataTableField } from 'web-components/data-table';

export interface IDataTableField<T> {

    /**
     * Name of the field
     */
    name: (item: T) => string | Observable<string>;

    /**
     * Value of the field
     */
    value: (item: T) => string | Observable<string>;

    /**
     * Indicates if field should be hidden on small screens
     */
    hideOnSmallScreen: boolean;

    /**
     * Column name of the key.
     * Required for sorting, but otherwise it is optional.
     */
    sortKey?: string;
}

export interface IDataTableResponse {
    items: any[];
    totaltems: number;
}

export interface IDataTableCountResponse {
    count: number;
}

export interface IDataTableButton<T> {

    /**
     * Icon of action
     */
    icon: string;

    /**
     * Action upon clicking the button
     */
    action: (item: T) => void;

    /**
     * Tooltip
     */
    tooltip?: (item: T) => Observable<string>;
}

export interface IFilter {
    guid: string;
    name: Observable<string>;
    filter: (page: number, pageSize: number, search: string, limit?: number, sort?: IDataTableSort) => Observable<IDataTableResponse>;
    count: ((search: string) => Observable<IDataTableCountResponse>) | number;

    priority: number;
}

export interface IDataTableSort {
    order: DataTableSortEnum;
    field: DataTableField<any>;
}
