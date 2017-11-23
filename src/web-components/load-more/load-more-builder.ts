import { LoadMoreConfig } from './load-more.config';
import { Observable } from 'rxjs/RX';
import { ResponseMultiple, IItem, MultipleItemQuery } from '../../lib/repository';
import { LoadMoreResponse } from './load-more.models';

export class LoadMoreBuilder<TItem extends IItem> {

    public config: LoadMoreConfig;

    constructor(
        /**
         * Query
         */
        private query: (search: string) => MultipleItemQuery<TItem>
    ) {
        this.config = new LoadMoreConfig();
    }

    useSeparator(use: boolean): this {
        this.config.useSeparator = use;
        return this;
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

    iconResolver(resolver: (item: TItem) => string | undefined): this {
        this.config.iconResolver = resolver;
        return this;
    }

    iconClassResolver(resolver: (item: TItem) => string): this {
        this.config.iconClassResolver = resolver;
        return this;
    }

    imageResolver(resolver: (item: TItem) => string | undefined): this {
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
    * Text to be shown in the listing. Can include HTML.
    */
    text(resolver: (item: TItem) => Observable<string>): this {
        this.config.text = resolver;
        return this;
    }

    /**
    * Title to be shown in the listing. Can include HTML.
    */
    title(resolver: (item: TItem) => Observable<string>): this {
        this.config.title = resolver;
        return this;
    }

    /**
    * Footer text to be shown in the listing. Can include HTML.
    */
    footer(resolver: (item: TItem) => Observable<string>): this {
        this.config.footer = resolver;
        return this;
    }

    /**
    * Indicates if local loader is enabled
    */
    enableLocalLoader(enable: boolean): this {
        this.config.enableLocalLoader = enable;
        return this;
    }

    build(): LoadMoreConfig {
         // assign observable
         this.config.data = (page: number, pageSize: number, search: string) => this.getDataResponse(this.query, page, pageSize, search);
        return this.config;
    }

    private getDataResponse(inputQuery: (search) => MultipleItemQuery<TItem>, page: number, pageSize: number, search: string): Observable<LoadMoreResponse> {
        const query = inputQuery(search);

        if (pageSize) {
            query.pageSize(pageSize);
        }

        if (page) {
            query.page(page);
        }

        return query.get().map(response => new LoadMoreResponse(response.items, response.pages, response.totalItems));
    }
}
