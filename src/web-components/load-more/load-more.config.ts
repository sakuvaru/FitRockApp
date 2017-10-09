import { Observable } from 'rxjs/Observable';
import { MultipleItemQuery, IItem, ResponseMultiple } from '../../lib/repository';
import { LoadMoreField } from './load-more-field.class';

export class LoadMoreConfig<TItem extends IItem> {

    /**
     * Indicates if component is wrapped in a material design card
     */
    public readonly wrapInCard: boolean = true;

    /**
     * Indicates if search is shown
     */
    public showSearch = true;

    /**
     * Key of translation that is shown when no search results are found
     */
    public searchNoItemsTextKey = 'webComponents.loadMore.noSearchResultsText';

    /**
     * Key of translation that is shown when data table contains 0 items
     */
    public noItemsTextKey = 'webComponents.loadMore.noResultsText';

    /**
     * Page size
     */
    public pageSize = 10;

    /**
     * Text to be shown in the listing
     */
    public text?: LoadMoreField<TItem>;

    /**
     * Title to be shown in the listing
     */
    public title?: LoadMoreField<TItem>;

    /**
     * Footer text to be shown in the listing
     */
    public footer?: LoadMoreField<TItem>;

    /**
     * Method that is used to get observable out of loadQuery.
     * Usually this should include 'takeUntil(this.ngUnsubscribe)' to ensure
     * that requests are cancelled if they are not required (e.g. after destroying component)
     */
    public loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>;

    /**
     * Used to specify query that loads items
     */
    public loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>;

    /**
     * On click handled
     */
    public onClick?: (item: TItem) => void;

    /**
     * If set, icon with with given function will be resolved, return name of the icon
     */
    public iconResolver?: (item: TItem) => string;

    /**
     * Resolver for icon class
     */
    public iconClassResolver?: (item: TItem) => string;

    /**
     * Used to generate image from URL
     */
    public imageResolver?: (item: TItem) => string;

    /**
     * Handler executed after items are loaded
     */
    public onAfterLoad?: (isInitialLaod: boolean) => void;

    /**
     * Handler executed before items are loaded
     */
    public onBeforeLoad?: (isInitialLoad: boolean) => void;

     /**
     * Loader configuration
     */
    public loaderConfig?: { start: () => void, stop: () => void };

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;
    
    constructor(
        loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>,
        loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>) {
        this.loadQuery = loadQuery;
        this.loadResolver = loadResolver;
    }

    isClickable(): boolean {
        return !(!this.onClick);
    }
}
