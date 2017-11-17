import { Observable } from 'rxjs/Rx';

export interface IDataTableField<T> {

    /**
     * Name of the field
     */
     name: (item: T) => string | Observable<string>;

    /**
     * Value of the field
     */
     value: (item: T) => string | Observable<string>;
}
