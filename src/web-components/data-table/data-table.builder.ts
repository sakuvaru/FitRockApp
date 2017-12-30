import { AppConfig } from 'app/config';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { DeleteItemQuery, IItem, ItemCountQuery, MultipleItemQuery } from '../../lib/repository';
import {
    AllFilter,
    DataTableAvatar,
    DataTableButton,
    DataTableCountResponse,
    DataTableDeleteResponse,
    DataTableField,
    DataTableResponse,
    DynamicFilter,
    Filter,
} from './data-table-models';
import { DataTableSortEnum } from './data-table-sort.enum';
import { DataTableConfig } from './data-table.config';
import { IDataTableButton, IDataTableField, IDataTableSort } from './data-table.interfaces';
import { DataTableMode } from './data-table-mode.enum';

// export table config
export { DataTableConfig };

export interface IDynamicFilter<TItem extends IItem> {
    guid: string;
    name: Observable<string>;
    query: ((query: MultipleItemQuery<TItem>) => MultipleItemQuery<TItem>);
    count: number;
    priority?: number;
}

export interface IStaticFilter<TItem extends IItem> {
    guid: string;
    name: Observable<string>;
    query: ((query: MultipleItemQuery<TItem>) => MultipleItemQuery<TItem>);
    count?: ((query: MultipleItemQuery<TItem>) => ItemCountQuery);
    priority?: number;
}

export class DataTableBuilder<TItem extends IItem> {

    public config: DataTableConfig;

    private filters: Filter[] = [];

    constructor(
        /**
         * Query
         */
        private readonly query: (search: string) => MultipleItemQuery<TItem>
    ) {
        this.config = new DataTableConfig();

        // set default properties
        this.config.noDataImageUrl = AppConfig.NoDataImageUrl;
    }

    /**
    * Number by which tiles will be grouped by
    */
    groupByItemsCount(number: number = 4): this {
        this.config.groupByItemsCount = number;
        return this;
    }

    /**
     * Data table mode.
     * Tiles mode is a simple mode that displays only item's name (first column or the result defined by itemName property)
     * and/or image
     */
    mode(mode: DataTableMode): this {
        this.config.mode = mode;
        return this;
    }

    /**
     * On click event
     * @param event Event 
     */
    onClick(event: (item: TItem) => void): this {
        this.config.onClick = event;
        return this;
    }

    /**
    * Limit
    */
    limit(limit: number): this {

        this.config.limit = limit;
        return this;
    }

    /**
    * Page
    */
    page(page: number): this {
        this.config.page = page;
        return this;
    }

    /**
    * Page size
    */
    pageSize(pageSize: number): this {
        this.config.pageSize = pageSize;
        return this;
    }

    /**
     * Adds field to list
     * @param field Field to add
     */
    withField(field: IDataTableField<TItem>): this {
        this.config.fields.push(new DataTableField(field.name, field.value, field.hideOnSmallScreen, field.sortKey));
        return this;
    }

    /**
     * Adds array of fields to list
     * @param fields Fields to add
     */
    withFields(fields: IDataTableField<TItem>[]): this {
        this.config.fields = _.union(this.config.fields, fields.map(m => new DataTableField(m.name, m.value, m.hideOnSmallScreen, m.sortKey)));
        return this;
    }

    /**
     * Adds button to list
     * @param button Button to add
     */
    withButton(button: IDataTableButton<TItem>): this {
        this.config.buttons.push(new DataTableButton(button.icon, button.action, button.tooltip));
        return this;
    }

    /**
     * Adds array of buttons to list
     * @param buttons buttons to add
     */
    withButtons(buttons: IDataTableButton<TItem>[]): this {
        this.config.buttons = _.union(this.config.buttons, buttons.map(m => new DataTableButton(m.icon, m.action, m.tooltip)));
        return this;
    }

    /**
     * Delete action
     * @param resolver Delete resolver
     */
    deleteAction(resolver: (item: TItem) => DeleteItemQuery, itemName?: (item: TItem) => string): this {
        this.config.deleteAction = (item) => resolver(item)
            .set()
            .map(response => new DataTableDeleteResponse(true))
            .catch(err => {
                return Observable.throw(new DataTableDeleteResponse(false, err));
            });

        this.config.itemName = itemName;

        return this;
    }

    /**
     * Sets dynamic filters
     * @param filters Dynamic filters
     */
    withDynamicFilters(filtersQuery: (search: string) => Observable<IDynamicFilter<TItem>[]>): this {

        const dynamicFiltersObs = (search) => filtersQuery(search).map(dynamicFilters => {
            const returnfilters: DynamicFilter[] = [];

            dynamicFilters.forEach(dynamicFilter => {
                // resolve filter query using the 'base' query
                const filterQuery = (filterSearch) => {
                    return dynamicFilter.query(this.query(search));
                };

                returnfilters.push(
                    new DynamicFilter(
                        dynamicFilter.guid,
                        dynamicFilter.name,
                        (page: number, pageSize: number, xSearch: string, limit?: number, sort?: IDataTableSort) => this.getDataResponse(filterQuery, page, pageSize, xSearch, limit, sort),
                        dynamicFilter.count,
                        dynamicFilter.priority ? dynamicFilter.priority : 2
                    ));
            });

            return returnfilters;
        });

        this.config.dynamicFilters = dynamicFiltersObs;

        return this;
    }

    /**
     * Indicates if pager should be rendered
     * @param render If pager should be rendered
     */
    renderPager(render: boolean): this {
        this.config.renderPager = render;
        return this;
    }

    /**
    * Page size options
    */
    pageSizeOptions(options: number[]): this {
        this.config.pageSizeOptions = options;
        return this;
    }

    /**
    * Sets up filters
    * @param filters filters
    */
    withFilters(filters: IStaticFilter<TItem>[]): this {
        const returnfilters: Filter[] = [];

        filters.forEach(filter => {
            // resolve filter query using the 'base' query
            const filterQuery = (search) => {
                return filter.query(this.query(search));
            };

            // resolve count query using the 'base' query
            let countQuery;
            const filterCount = filter.count;
            if (filterCount) {
                // user custom count query
                countQuery = (search) => filterCount(this.query(search));
            } else {
                // use default count query
                countQuery = (search) => filterQuery(search).toCountQuery();
            }

            returnfilters.push(
                new Filter(
                    filter.guid,
                    filter.name,
                    (page: number, pageSize: number, search: string, limit?: number, sort?: IDataTableSort) => this.getDataResponse(filterQuery, page, pageSize, search, limit, sort),
                    (search) => this.getCountResponse(countQuery, search),
                    filter.priority ? filter.priority : 2
                ));
        });

        this.config.filters = returnfilters;
        return this;
    }

    /**
    * Indicates if last filter, search & page is remembered
    */
    rememberState(remember: boolean): this {
        this.config.rememberState = remember;
        return this;
    }

    /**
     * Indicates if all filters is used when filters are present
     */
    allFilter(name?: Observable<string>, resolver?: (search: string) => ItemCountQuery): this {
        // resolve filter query using the 'base' query
        const filterQuery = (search) => resolver ? resolver(search) : this.query(search).toCountQuery();

        this.config.allFilter =
            new AllFilter(
                name,
                (page: number, pageSize: number, search: string, limit?: number, sort?: IDataTableSort) => this.getDataResponse(this.query, page, pageSize, search, limit, sort),
                (search) => this.getCountResponse(filterQuery, search),
            );

        return this;
    }

    avatarIcon(resolver: (item: TItem) => string): this {
        this.config.avatar = (item) => {
            return new DataTableAvatar(undefined, resolver(item));
        };

        return this;
    }

    avatarImage(resolver: (item: TItem) => string): this {
        this.config.avatar = (item) => {
            return new DataTableAvatar(resolver(item), undefined);
        };

        return this;
    }

    /**
     * Url of image to be used if there are no data
     */
    noDataImageUrl(imageUrl: string): this {
        this.config.noDataImageUrl = imageUrl;
        return this;
    }

    /**
     * Gets the data table config
     */
    build(): DataTableConfig {
        // assign observable
        this.config.getData = (page: number, pageSize: number, search: string, limit?: number, sort?: IDataTableSort) => this.getDataResponse(this.query, page, pageSize, search, limit, sort);
        return this.config;
    }

    private getCountResponse(inputQuery: (search) => ItemCountQuery, search: string): Observable<DataTableCountResponse> {
        const query = inputQuery(search);

        return query.get()
            .map(response => {
                return new DataTableCountResponse(response.count);
            });
    }

    private getDataResponse(inputQuery: (search) => MultipleItemQuery<TItem>, page: number, pageSize: number, search: string, limit?: number, sort?: IDataTableSort): Observable<DataTableResponse> {
        const query = inputQuery(search);

        if (limit) {
            query.limit(limit);
        }

        if (pageSize) {
            query.pageSize(pageSize);
        }

        if (page) {
            query.page(page);
        }

        if (sort) {
            // apply sort only if key (field column) was provided
            if (sort.order === DataTableSortEnum.Asc && sort.field.sortKey) {
                query.orderByAsc(sort.field.sortKey);
            } else if (sort.field.sortKey) {
                query.orderByDesc(sort.field.sortKey);
            }
        }

        return query.get().map(response => new DataTableResponse(response.items, response.totalItems));
    }
}
