import { DataTableConfig } from './data-table.config';
import { DataTableField } from './data-table-field.class';
import { Observable } from 'rxjs/RX';
import { ResponseMultiple } from '../../repository';

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

    urlResolver(resolver: (item: T) => string): this {
        this.config.urlResolver = resolver;
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

    searchNoItemsText(text: string): this {
        this.config.searchNoItemsText = text;
        return this;
    }

    noItemsText(text: string): this {
        this.config.noItemsText = text;
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