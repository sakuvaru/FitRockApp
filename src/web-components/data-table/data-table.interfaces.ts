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
