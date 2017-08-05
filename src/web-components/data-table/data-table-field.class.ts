import { AlignEnum } from './align-enum';

export class DataTableField<T> {

    /**
     * Value of the field
     */
    public value: (item: T) => string;

    // optional properties
    /**
     * translated value of 'labelKey' (if provided) is stored here
     */
    public label?: string;

    /**
     * Label key -> used to translate label
     */
    public labelKey?: string;

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
    public hideOnSmallScreens?: boolean = false;
}   