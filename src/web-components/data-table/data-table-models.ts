import { Observable } from 'rxjs/Rx';
import { guidHelper, stringHelper } from '../../lib/utilities';
import { IDataTableButton, IDataTableField, IDataTableCountResponse, IDataTableResponse,
IFilter } from './data-table.interfaces';

export class DataTableField<T> implements IDataTableField<T> {
    constructor(
        /**
         * Name of the field
         */
        public name: (item: T) => string | Observable<string>,

        /**
         * Value of the field
         */
        public value: (item: T) => string | Observable<string>,

        /**
         * Indicates if field should be hidden on small screens
         */
        public hideOnSmallScreen: boolean
    ) { }

    isObservable(result: string | Observable<string>): boolean {
        return result instanceof Observable;
    }
}

export class DataTableButton<T> implements DataTableButton<T> {

    constructor(
        /**
        * Icon of action
        */
        public icon: string,
        /**
         * Action upon clicking the button
         */
        public action: (item: T) => any,
        /**
        * Tooltip
        */
        public tooltip?: (item: T) => Observable<string>
    ) { }
}

export class DataTableResponse implements IDataTableResponse {

    constructor(
        public items: any[],
        public totaltems: number
    ) { }

}

export class DataTableFieldWrapper {
    constructor(
        public field: DataTableField<any>,
        public nameDef: string
    ) { }
}

export class DataTableButtonWrapper {
    constructor(
        public buttons: DataTableButton<any>[],
        public nameDef: string
    ) { }
}

export class DataTableDeleteResponse {
    constructor(
        public isSuccessfull: boolean,
        public errorMessage?: string
    ) { }
}

export class DataTableCountResponse implements IDataTableCountResponse {
    constructor(
        public count: number
    ) {}
}

export class DynamicFilter implements IFilter {
    constructor(
        public guid: string,
        public name: Observable<string>,
        public filter: (page: number, pageSize: number, search: string, limit?: number) => Observable<DataTableResponse>,
        public count: number,
        /**
         * Higher priority = filter is on left
         */
        public priority
    ) {
    }
}

export class AllFilter {
    constructor(
        public filter: (page: number, pageSize: number, search: string, limit?: number) => Observable<DataTableResponse>,
        public count: (search: string) => Observable<DataTableCountResponse>,
    ) {}
}

export class Filter implements IFilter {

    private _hash?: number;

    constructor(
        public guid: string,
        public name: Observable<string>,
        public filter: (page: number, pageSize: number, search: string, limit?: number) => Observable<DataTableResponse>,
        public count: (search: string) => Observable<DataTableCountResponse>,
        /**
         * Higher priority = filter is on left
         */
        public priority
    ) {
    }
}

export class FilterWrapper {
    constructor(
        public resolvedName: string,
        public resolvedCount: number,
        public filter: IFilter
    ) {}
}

export class DataTableAvatar {
    constructor(
        public imageUrl?: string,
        public icon?: string
    ) {
    }

    isIcon(): boolean {
        if (this.icon) {
            return true;
        }

        return false;
    }

    isImage(): boolean {
        if (this.imageUrl) {
            return true;
        }

        return false;
    }
}

