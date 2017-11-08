import { AlignEnum } from './align-enum';
import { Observable } from 'rxjs/Observable';

export class DataListField<T> {

    /**
     * Value of the field
     */
    public value: (item: T) => string | Observable<string>;

    /**
     * translated value of 'labelKey' (if provided) is stored here
     */
    public label?: string  | Observable<string>;

    /**
     * Flex width
     */
    public flex?: number;

    /**
     * Indicates if field is subtle (smaller + faded color)
     */
    public isSubtle?: boolean;

    /**
     * Align of text in field
     */
    public align?: AlignEnum;

    /**
     * Indicates if field will be hidden on small screens
     */
    public hideOnSmallScreens? = false;

}
