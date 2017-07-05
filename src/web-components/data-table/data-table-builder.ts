import { DataTableConfig, SelectableConfig } from './data-table.config';
import { DataTableField } from './data-table-field.class';
import { Observable } from 'rxjs/RX';
import { ResponseMultiple } from '../../lib/repository';

export class DataTableBuilder<T> {

    private config: DataTableConfig<T> = new DataTableConfig<T>();

    fields(fields: DataTableField<T>[]): this {
        this.config.fields = fields;
        return this;
    }

    loadResolver(loadFunction: (searchTerm: string, page: number, pageSize: number) => Observable<ResponseMultiple<any>>): this {
        this.config.loadResolver = loadFunction;
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

    selectableConfig(config: SelectableConfig<T>): this {
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

    onClick(callback: (item: T) => void): this {
        this.config.onClick = callback;
        return this;
    }

    iconResolver(iconResolver: (item: T) => string): this {
        this.config.iconResolver = iconResolver;
        return this;
    }

    avatarUrlResolver(avatarResolver: (item: T) => string): this {
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

    build(): DataTableConfig<T>{
        return this.config;
    }

}