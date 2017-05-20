export class DataTableConfig<T> {
    public showHeader: boolean;
    public showSearch: boolean;
    public url?: (item: T) => string;

    constructor(
        public fields?: {
            showHeader?: boolean,
            showSearch?: boolean,
            url?: (item: T) => string;
        }) {
        if (fields) Object.assign(this, fields);
    }

}