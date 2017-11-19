import { Observable } from 'rxjs/Rx';
import { guidHelper, stringHelper } from '../../lib/utilities';
import { IDataTableButton, IDataTableField } from './data-table.interfaces';

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

export class DataTableResponse {

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

export class DataTableCountResponse {
    constructor(
        public count: number
    ) {}
}

export class Filter {

    private _hash?: number;

    constructor(
        public name: Observable<string>,
        public filter: (page: number, pageSize: number, search: string, limit?: number) => Observable<DataTableResponse>,
        public count: (search: string) => Observable<DataTableCountResponse>,
        /**
         * Higher priority = filter is on left
         * Default is 2, while all filter is using 1
         */
        public priority: number = 2
    ) {
    }
}

export class FilterWrapper {
    constructor(
        public resolvedName: string,
        public resolvedCount: number,
        public filter: Filter
    ) {}
}

