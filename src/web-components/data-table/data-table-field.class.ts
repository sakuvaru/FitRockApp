import { AlignEnum } from './align-enum';

export class DataTableField<T> {
    // required properties
    public label: string;
    public value: (item: T) => string;

    // optional properties
    public flex?: number;
    public isSubtle?: boolean;
    public align?: AlignEnum;
}   