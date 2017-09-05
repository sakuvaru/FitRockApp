import { LoadMoreConfig } from './load-more.config';
import { Observable } from 'rxjs/RX';
import { ResponseMultiple, IItem, MultipleItemQuery } from '../../lib/repository';
import { LoadMoreField } from './load-more-field.class';

export class LoadMoreBuilder<TItem extends IItem> {

    private config: LoadMoreConfig<TItem>;

    constructor(
        public loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>,
        public loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>,
    ) {
        this.config = new LoadMoreConfig(loadResolver, loadQuery);
    }

    showSearch(show: boolean): this {
        this.config.showSearch = show;
        return this;
    }

    pageSize(size: number): this {
        this.config.pageSize = size;
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

    iconResolver(resolver: (item: TItem) => string): this {
        this.config.iconResolver = resolver;
        return this;
    }

    
    iconClassResolver(resolver: (item: TItem) => string): this {
        this.config.iconClassResolver = resolver;
        return this;
    }

    imageResolver(resolver: (item: TItem) => string): this {
        this.config.imageResolver = resolver;
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

    /**
     * Text to be shown in the listing
    */
    public text(field: LoadMoreField<TItem>): this {
        this.config.text = field;
        return this;
    }

    /**
     * Title to be shown in the listing
     */
    public title(field: LoadMoreField<TItem>): this {
        this.config.title = field;
        return this;
    }

    /**
       * Footer text to be shown in the listing
       */
    public footer(field: LoadMoreField<TItem>): this {
        this.config.footer = field;
        return this;
    }

    build(): LoadMoreConfig<TItem> {
        return this.config;
    }
}   