import { Observable } from 'rxjs/Observable';

export class DataTableConfig<T> {
    public loadItems: (searchTerm: string, page: number, pageSize: number) => Observable<any[]>;
    public showHeader: boolean;
    public showPager: boolean;
    public showSearch: boolean;
    public pagerSize?: number;
    public url?: (item: T) => string;
    public icon?: (item: T) => string;
    public avatarUrl?: (item: T) => string;

    constructor(
        public fields?: {
            loadItems?: (searchTerm: string, page: number, pageSize: number) => Observable<any[]>,
            showHeader?: boolean,
            showPager?: boolean,
            showSearch?: boolean,
            pagerSize?: number,
            url?: (item: T) => string,
            icon?: (item: T) => string,
            avatarUrl?: (item: T) => string
        }) {
        if (fields) Object.assign(this, fields);
    }

}