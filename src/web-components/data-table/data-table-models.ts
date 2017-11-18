import { Observable } from 'rxjs/Rx';

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
    ) {}
}
