import { Observable } from 'rxjs/Observable';
import { ResponseMultiple } from '../../lib/repository';
import { DataTableField } from './data-table-field.class';

export class DataTableConfig<T> {
    public fields: DataTableField<any>[];

    public wrapInCard: boolean = true;
    public showHeader: boolean = false;
    public showPager: boolean = true;
    public showSearch: boolean = true;
    public pagerSize: number = 10;
    public searchNoItemsTextKey: string = 'webComponents.dataTable.noSearchResultsText'
    public noItemsTextKey: string = 'webComponents.dataTable.noResultsText';
    public showPagerNextPreviousButtons: boolean = true;
    public showPagerFirstLastButtons: boolean = true;
    public showPagerNumberButtons: boolean = true;
    public hidePagerForSinglePage: boolean = true;

    public loadResolver: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>;
    public onClick: (item: T) => void;
    public iconResolver: (item: T) => string;
    public avatarUrlResolver: (item: T) => string;
    public onAfterLoad: () => void;
    public onBeforeLoad: () => void;

    public selectableConfig: SelectableConfig<T>;

    constructor(
        public options?: {
            wrapInCard?: boolean,
            fields: DataTableField<any>[];
            loadResolver?: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>,
            showHeader?: boolean,
            showPager?: boolean,
            showSearch?: boolean,
            pagerSize?: number,
            iconResolver?: (item: T) => string,
            avatarUrlResolver?: (item: T) => string,
            searchNoItemsText?: string,
            noItemsText?: string,
            showPagerNextPreviousButtons?: boolean,
            showPagerFirstLastButtons?: boolean,
            showPagerNumberButtons?: boolean,
            hidePagerForSinglePage?: boolean,
            onAfterLoad?: () => void,
            onBeforeLoad?: () => void,
            onClick?: (item: T) => void,
            selectableConfig?: SelectableConfig<T>
        }) {
        if (options) Object.assign(this, options);
    }

    isSelectable(): boolean {
        return !(!this.selectableConfig);
    }

    isClickable(): boolean {
        return !(!this.onClick);
    }
}

export class SelectableConfig<T>{

    public buttonTextKey: string;
    public onSelect: (selectedItem: T) => void;
    public onDeselect: (unselectedItem: T) => void;

    constructor(
        options: {
            buttonTextKey: string,
            onSelect: (selectedItem: T) => void,
            onDeselect: (selectedItem: T) => void
        }
    ) {
        Object.assign(this, options);
    }
}