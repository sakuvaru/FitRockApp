import { Observable } from 'rxjs/Observable';
import { MultipleItemQuery, IItem, ResponseMultiple, ItemCountQuery, ErrorResponse } from '../../lib/repository';
import { DataTableField } from './data-table-field.class';
import { guidHelper, stringHelper } from '../../lib/utilities';

export class DataTableConfig<TItem extends IItem> {

    /**
     * Indicates if last used filter will be used on the next load of given data table
     */
    public saveLastFilter: boolean = true;

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Indicates if data table is wrapped in a material design card
     */
    public wrapInCard = true;

    /**
     * Indicate if header with columns is shown. All fields need to configure their labels if enabled
     */
    public showHeader = false;

    /**
     * Indicates if search is shown
     */
    public showSearch = true;

    /**
     * Key of translation that is shown when no search results are found
     */
    public searchNoItemsTextKey = 'webComponents.dataTable.noSearchResultsText';

    /**
     * Key of translation that is shown when data table contains 0 items
     */
    public noItemsTextKey = 'webComponents.dataTable.noResultsText';

    /**
     * Indicates if filter with all items is shown
     */
    public showAllFilter = false;

    /**
     * Callback for handling errors
     */
    public onError?: (response: ErrorResponse | any) => void;

    /**
     * On click handled
     */
    public onClick?: (item: TItem) => void;

    /**
     * If set, icon with with given function will be resolved, return name of the icon
     */
    public iconResolver?: (item: TItem) => string;

    /**
     * If set, avatar with given fucntion will be resolved - return URL of the image
     */
    public avatarUrlResolver?: (item: TItem) => string;

    /**
     * Handler executed after items are loaded
     */
    public onAfterLoad?: (isInitialLaod: boolean) => void;

    /**
     * Handler executed before items are loaded
     */
    public onBeforeLoad?: (isInitialLoad: boolean) => void;

    /**
     * Set of dynamic filters (do not combine with static filters)
     */
    public dynamicFilters?: <TFilter extends Filter<IItem>>(searchTerm: string) => Observable<Filter<IItem>[]>;

    /**
     * Set of static filters (do not combine with dynamic filters)
     */
    public staticFilters: Filter<TItem>[] = [];

    /**
     * Configuratino of pager
     */
    public pagerConfig: PagerConfig = new PagerConfig();

    /**
     * Configuration of selectable data table
     */
    public selectableConfig: SelectableConfig<TItem>;

    /**
     * Loader configuration
     */
    public loaderConfig?: { start: () => void, stop: () => void };

    constructor(
        /**
        * Method that is used to get observable out of loadQuery.
        * Usually this should include 'takeUntil(this.ngUnsubscribe)' to ensure
        * that requests are cancelled if they are not required (e.g. after destroying component)
        */
        public loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>,
        /**
        * Used to specify query that loads items
        */
        public loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>,
        /**
        * Fields in the data table
        */
        public fields: DataTableField<TItem>[]
    ) { }

    isSelectable(): boolean {
        return !(!this.selectableConfig);
    }

    isClickable(): boolean {
        return !(!this.onClick);
    }

    /**
     * Gets unique hash of the configuration of data table
     */
    getHash(): number {
        const allProperties = Object.getOwnPropertyNames(this);
        let fullText = '';
        allProperties.forEach(property => {
            const propertyValue = this[property];
            if (propertyValue) {
                fullText +=  property + '=' + propertyValue;
            }
        });
        return stringHelper.getHash(fullText);
    }
}

export class PagerConfig {
    public showPager = true;
    public pagerSize = 6;
    public showPagerNextPreviousButtons = true;
    public showPagerFirstLastButtons = true;
    public showPagerNumberButtons = true;
    public hidePagerForSinglePage = true;
    /**
     * If enabled, material buttons will be used for paging
     */
    public usePagerButtons: boolean = true;
}

export class SelectableConfig<TItem extends IItem> {

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

export class Filter<TItem extends IItem> {

    public filterNameKey: string;
    public count?: number;
    public guid: string;

    public onFilter: (query: MultipleItemQuery<TItem>) => MultipleItemQuery<TItem>;
    public countQuery?: (query: MultipleItemQuery<TItem>) => ItemCountQuery;

    constructor(
        options: {
            filterNameKey: string,
            onFilter: (query: MultipleItemQuery<TItem>) => MultipleItemQuery<TItem>,
            count?: number,
            countQuery?: (query: MultipleItemQuery<TItem>) => ItemCountQuery
        }
    ) {
        Object.assign(this, options);
        // use filterNameKey as guid
        this.guid = this.filterNameKey;
    }
}
