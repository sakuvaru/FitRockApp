import { Observable } from 'rxjs/Observable';
import { ResponseMultiple } from '../../repository';
import { DataTableField } from './data-table-field.class';

export class DataTableConfig<T> {
    public fields: DataTableField<any>[];
    public loadResolver: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>;
    public showHeader?: boolean = true;
    public showPager?: boolean = true;
    public showSearch?: boolean = true;
    public pagerSize?: number = 10;
    public urlResolver?: (item: T) => string;
    public iconResolver?: (item: T) => string;
    public avatarUrlResolver?: (item: T) => string;
    public searchNoItemsTextKey?: string = 'webComponents.dataTable.noSearchResultsText'
    public noItemsTextKey?: string = 'webComponents.dataTable.noResultsText';
    public showPagerNextPreviousButtons?: boolean = true;
    public showPagerFirstLastButtons?: boolean = true;
    public showPagerNumberButtons?: boolean = true;
    public hidePagerForSinglePage?: boolean = true;

    constructor(
        public options?: {
            fields: DataTableField<any>[];
            loadResolver?: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>,
            showHeader?: boolean,
            showPager?: boolean,
            showSearch?: boolean,
            pagerSize?: number,
            urlResolver?: (item: T) => string,
            iconResolver?: (item: T) => string,
            avatarUrlResolver?: (item: T) => string,
            searchNoItemsText?: string,
            noItemsText?: string,
            showPagerNextPreviousButtons?: boolean,
            showPagerFirstLastButtons?: boolean,
            showPagerNumberButtons?: boolean,
            hidePagerForSinglePage?: boolean;
        }) {
        if (options) Object.assign(this, options);
    }
}