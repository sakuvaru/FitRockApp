export class DataTableConfig<T> {
    public showHeader: boolean;
    public showSearch: boolean;
    public usePager: boolean;
    public pagerSize?: number;
    public pagerClick?: (page: number, pageSize: number) => void;
    public url?: (item: T) => string;
    public icon?: (item: T) => string;
    public avatarUrl?: (item: T) => string;

    constructor(
        public fields?: {
            showHeader?: boolean,
            showSearch?: boolean,
            usePager?: boolean,
            pagerSize?: number;
            pagerClick?: (page: number, pageSize: number) => void;
            url?: (item: T) => string,
            icon?: (item: T) => string;
            avatarUrl?: (item: T) => string;
        }) {
        if (fields) Object.assign(this, fields);
    }

}