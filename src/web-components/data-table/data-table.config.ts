import { Observable } from 'rxjs/Observable';
import { MultipleItemQuery, IItem, ResponseMultiple } from '../../lib/repository';
import { DataTableField } from './data-table-field.class';
import { Guid, StringHelper } from '../../lib/utilities';

export class DataTableConfig<TItem extends IItem> {

    public fields: DataTableField<any>[];
    public wrapInCard: boolean = true;
    public showHeader: boolean = false;
    public showSearch: boolean = true;
    public searchNoItemsTextKey: string = 'webComponents.dataTable.noSearchResultsText'
    public noItemsTextKey: string = 'webComponents.dataTable.noResultsText';
    public showAllFilter: boolean = false;
    public saveLastFilter: boolean = true;

    public loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>;
    public loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>;
    public onClick: (item: TItem) => void;
    public iconResolver: (item: TItem) => string;
    public avatarUrlResolver: (item: TItem) => string;
    public onAfterLoad: () => void;
    public onBeforeLoad: () => void;

    public dynamicFilters: <TFilter extends Filter<IItem>>(searchTerm: string) => Observable<Filter<IItem>[]>;
    public staticFilters: Filter<TItem>[] = [];

    public pagerConfig: PagerConfig = new PagerConfig();
    public selectableConfig: SelectableConfig<TItem>;

    constructor(
        public options?: {
            // required 
            loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>;
            loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>;
            fields: DataTableField<any>[];

            // optional 
            wrapInCard?: boolean,
            showHeader?: boolean,
            showPager?: boolean,
            showSearch?: boolean,
            iconResolver?: (item: TItem) => string,
            avatarUrlResolver?: (item: TItem) => string,
            searchNoItemsText?: string,
            noItemsText?: string,
            onAfterLoad?: () => void,
            onBeforeLoad?: () => void,
            onClick?: (item: TItem) => void,
            staticFilters: Filter<TItem>[],
            selectableConfig?: SelectableConfig<TItem>,
            pagerConfig?: PagerConfig,
            showAllFilter: boolean,
            saveLastFilter: boolean,
            dynamicFilters?: <TFilter extends Filter<IItem>>(searchTerm: string) => Observable<Filter<IItem>[]>
        }) {
        Object.assign(this, options);
    }

    isSelectable(): boolean {
        return !(!this.selectableConfig);
    }

    isClickable(): boolean {
        return !(!this.onClick);
    }

    getHash(): number{
        var allProperties = Object.getOwnPropertyNames(this);
        var fullText = '';
        allProperties.forEach(property => {
            var propertyValue = this[property];
            if (propertyValue){
                fullText +=  property + '=' + propertyValue;
            }
        })
        return StringHelper.getHash(fullText);
    }
}

export class PagerConfig{
    public showPager: boolean = true;
    public pagerSize: number = 6;
    public showPagerNextPreviousButtons: boolean = true;
    public showPagerFirstLastButtons: boolean = true;
    public showPagerNumberButtons: boolean = true;
    public hidePagerForSinglePage: boolean = true;
}

export class SelectableConfig<TItem extends IItem>{

    public onSelect: (selectedItem: TItem) => void;
    public onDeselect: (unselectedItem: TItem) => void;

    constructor(
        options: {
            onSelect: (selectedItem: TItem) => void,
            onDeselect: (selectedItem: TItem) => void
        }
    ) {
        Object.assign(this, options);
    }
}

export class Filter<TItem extends IItem>{

    public filterNameKey: string;
    public onFilter: (query: MultipleItemQuery<TItem>) => MultipleItemQuery<TItem>;
    public count?: number;
    public guid: string;

    constructor(
        options: {
            filterNameKey: string,
            onFilter: (query: MultipleItemQuery<TItem>) => MultipleItemQuery<TItem>,
            count?: number
        }
    ) { 
        Object.assign(this, options);
        // use filterNameKey as guid
        this.guid = this.filterNameKey;
    }
}