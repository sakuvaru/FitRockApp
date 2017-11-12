import { DataListConfig, SelectableConfig, Filter, PagerConfig } from './data-list.config';
import { DataListField } from './data-list-field.class';
import { Observable } from 'rxjs/RX';
import { BaseMultipleItemQuery, ResponseMultiple, IItem, MultipleItemQuery, ErrorResponse } from '../../lib/repository';
import * as _ from 'underscore';

export class DataListBuilder<TItem extends IItem> {

    private config: DataListConfig<TItem>;

    constructor(
        /**
        * Used to specify query that loads items
        */
        loadQuery: (searchTerm: string) => BaseMultipleItemQuery,
        /**
         * Image to be displayed when there is no data
         */
        noDataImageUrl: string
    ) {
        this.config = new DataListConfig<TItem>(loadQuery);
        this.config.noDataImageUrl = noDataImageUrl;
    }

    /**
     * Image used when there is no data in list
     * @param imageUrl Image url
     */
    noDataImageUrl(imageUrl: string): this {
        this.config.noDataImageUrl = imageUrl;
        return this;
    }

    /**
     * Adds field to list
     * @param field Field to add
     */
    withField(field: DataListField<TItem>): this {
        this.config.fields.push(field);
        return this;
    }

    /**
     * Adds array of fields to list
     * @param fields Fields to add
     */
    withFields(fields: DataListField<TItem>[]): this {
        this.config.fields = _.union(this.config.fields, fields);
        return this;
    }

    /**
    * Indicates if last used filter will be used on the next load of given data list
    */
    saveLastFilter(save: boolean): this {
        this.config.saveLastFilter = save;
        return this;
    }

    enableLocalLoader(enabled: boolean): this {
        this.config.enableLocalLoader = enabled;
        return this;
    }

    /**
    * Callback for handling errors
    */
    onError(callback: (response: ErrorResponse | any) => void): this {
        this.config.onError = callback;
        return this;
    }

    filter(filter: Filter<TItem>): this {
        this.config.staticFilters.push(filter);
        return this;
    }

    filters(filters: Filter<TItem>[]): this {
        if (filters && filters.length > 0) {
            filters.forEach(filter => this.config.staticFilters.push(filter));
        }
        return this;
    }

    showAllFilter(show: boolean): this {
        this.config.showAllFilter = show;
        return this;
    }

    dynamicFilters(filterLoader: <TFilter extends Filter<IItem>>(searchTerm: string) => Observable<Filter<IItem>[]>): this {
        this.config.dynamicFilters = filterLoader;
        return this;
    }

    wrapInCard(wrap: boolean): this {
        this.config.wrapInCard = wrap;
        return this;
    }

    showHeader(show: boolean): this {
        this.config.showHeader = show;
        return this;
    }

    pagerConfig(config: PagerConfig): this {
        if (config) {
            this.config.pagerConfig = config;
        }
        return this;
    }

    showPager(show: boolean): this {
        this.config.pagerConfig.showPager = show;
        return this;
    }

    showSearch(show: boolean): this {
        this.config.showSearch = show;
        return this;
    }

    pagerSize(size: number): this {
        this.config.pagerConfig.pagerSize = size;
        return this;
    }

    selectableConfig(config: SelectableConfig<TItem>): this {
        this.config.selectableConfig = config;
        return this;
    }

    onBeforeLoad(callback: (isInitialLoad: boolean) => void): this {
        this.config.onBeforeLoad = callback;
        return this;
    }

    onAfterLoad(callback: (isInitialLoad: boolean) => void): this {
        this.config.onAfterLoad = callback;
        return this;
    }

    onClick(callback: (item: TItem) => void): this {
        this.config.onClick = callback;
        return this;
    }

    iconResolver(iconResolver: (item: TItem) => string): this {
        this.config.iconResolver = iconResolver;
        return this;
    }

    avatarUrlResolver(avatarResolver: (item: TItem) => string): this {
        this.config.avatarUrlResolver = avatarResolver;
        return this;
    }

    searchNoItemsTextKey(text: string): this {
        this.config.searchNoItemsTextKey = text;
        return this;
    }

    noItemsTextKey(text: string): this {
        this.config.noItemsTextKey = text;
        return this;
    }

    showPagerNextPreviousButtons(show: boolean): this {
        this.config.pagerConfig.showPagerNextPreviousButtons = show;
        return this;
    }

    showPagerFirstLastButtons(show: boolean): this {
        this.config.pagerConfig.showPagerFirstLastButtons = show;
        return this;
    }

    showPagerNumberButtons(show: boolean): this {
        this.config.pagerConfig.showPagerNumberButtons = show;
        return this;
    }

    hidePagerForSinglePage(hide: boolean): this {
        this.config.pagerConfig.hidePagerForSinglePage = hide;
        return this;
    }

    loaderConfig(start: () => void, stop: () => void): this {
        this.config.loaderConfig = { start: start, stop: stop };
        return this;
    }

    build(): DataListConfig<TItem> {
        return this.config;
    }
}
