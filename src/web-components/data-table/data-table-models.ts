import { Observable } from 'rxjs/Rx';

export class DataTableField<T> {
    constructor(
        /**
         * Name of the field
         */
        public name: (item: T) => string | Observable<string>,

        /**
         * Value of the field
         */
        public value: (item: T) => string | Observable<string>
    ) { }

    valueIsObservable(): boolean {
        return (this.value({} as any)) instanceof Observable;
    }

    nameIsObservable(): boolean {
        return (this.name({} as any)) instanceof Observable;
    }
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
    ) {}
}
