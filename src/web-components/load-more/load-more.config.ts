import { Observable } from 'rxjs/Observable';

import { LoadMoreResponse } from './load-more.models';

export class LoadMoreConfig {

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
     * Text to be shown in the listing, can include HTML
     */
    public text?: (item: any) => Observable<string>;

    /**
     * Title to be shown in the listing, can include HTML
     */
    public title?: (item: any) => Observable<string>;

    /**
     * Footer text to be shown in the listing, can include HTML
     */
    public footer?: (item: any) => Observable<string>;

    /**
     * On click handled
     */
    public onClick?: (item: any) => void;

    /**
     * If set, icon with with given function will be resolved, return name of the icon
     */
    public iconResolver?: (item: any) => string | undefined;

    /**
     * Resolver for icon class
     */
    public iconClassResolver?: (item: any) => string;

    /**
     * Used to generate image from URL
     */
    public imageResolver?: (item: any) => string | undefined;

    /**
     * Handler executed after items are loaded
     */
    public onAfterLoad?: (isInitialLaod: boolean) => void;

    /**
     * Handler executed before items are loaded
     */
    public onBeforeLoad?: (isInitialLoad: boolean) => void;

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Indicates if separator between items is used
     */
    public useSeparator: boolean = true;

    /**
     * Data of the load more response
     */
    public data?: (page: number, pageSize: number, search: string) => Observable<LoadMoreResponse>;
    
    isClickable(): boolean {
        return !(!this.onClick);
    }
}
