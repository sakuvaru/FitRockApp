import { DataTableConfig, SelectableConfig, Filter } from './data-table.config';
import { DataTableField } from './data-table-field.class';
import { Observable } from 'rxjs/RX';
import { ResponseMultiple, IItem, MultipleItemQuery } from '../../lib/repository';

export class DataTableBuilder<TItem extends IItem> {

    private config: DataTableConfig<TItem> = new DataTableConfig<TItem>();

    fields(fields: DataTableField<TItem>[]): this {
        this.config.fields = fields;
        return this;
    }

    loadQuery(loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>): this {
        this.config.loadQuery = loadQuery;
        return this;
    }

    loadResolver(loadFunction: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>): this {
        this.config.loadResolver = loadFunction;
        return this;
    }

    filter(filter: Filter<TItem>): this{
        this.config.filters.push(filter);
        return this;
    }

    filters(filters: Filter<TItem>[]): this{
        if (filters && filters.length > 0){
            filters.forEach(filter => this.config.filters.push(filter));
        }
        return this;
    }

    wrapInCard(wrap: boolean): this{
        this.config.wrapInCard = wrap;
        return this;
    }

    showHeader(show: boolean): this {
        this.config.showHeader = show;
        return this;
    }

    showPager(show: boolean): this {
        this.config.showPager = show;
        return this;
    }

    showSearch(show: boolean): this {
        this.config.showSearch = show;
        return this;
    }

    pagerSize(size: number): this {
        this.config.pagerSize = size;
        return this;
    }

    selectableConfig(config: SelectableConfig<TItem>): this {
        this.config.selectableConfig = config;
        return this;
    }
    
    onBeforeLoad(callback: () => void): this{
        this.config.onBeforeLoad = callback;
        return this;
    }

    onAfterLoad(callback: () => void): this{
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
        this.config.showPagerNextPreviousButtons = show;
        return this;
    }

    showPagerFirstLastButtons(show: boolean): this {
        this.config.showPagerFirstLastButtons = show;
        return this;
    }

    showPagerNumberButtons(show: boolean): this {
        this.config.showPagerNumberButtons = show;
        return this;
    }

    hidePagerForSinglePage(hide: boolean): this {
        this.config.hidePagerForSinglePage = hide;
        return this;
    }

    build(): DataTableConfig<TItem>{
        return this.config;
    }

}