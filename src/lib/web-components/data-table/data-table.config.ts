import { Observable } from 'rxjs/Observable';
import { ResponseMultiple } from '../../repository';

export class DataTableConfig<T> {
    public loadItems: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>;
    public showHeader?: boolean = true;
    public showPager?: boolean = true;
    public showSearch?: boolean = true;
    public pagerSize?: number = 10;
    public url?: (item: T) => string;
    public icon?: (item: T) => string;
    public avatarUrl?: (item: T) => string;
    public searchNoItemsText?: string = "Nenalezeny žádné výsledky";
    public noItemsText?: string = "Nejsou zde žádné data";
    public showPagerNextPreviousButtons?: boolean = true;
    public showPagerFirstLastButtons?: boolean = true;
    public showPagerNumberButtons?: boolean = true;

    constructor(
        public fields?: {
            loadItems?: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>,
            showHeader?: boolean,
            showPager?: boolean,
            showSearch?: boolean,
            pagerSize?: number,
            url?: (item: T) => string,
            icon?: (item: T) => string,
            avatarUrl?: (item: T) => string,
            searchNoItemsText?: string,
            noItemsText?: string,
            showPagerNextPreviousButtons?: boolean,
            showPagerFirstLastButtons?: boolean,
            showPagerNumberButtons?: boolean
        }) {
        if (fields) Object.assign(this, fields);
    }

}