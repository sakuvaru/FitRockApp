import { DataTableConfig } from './data-table.config';
import { Observable } from 'rxjs/Rx';
import { IItem, MultipleItemQuery, DeleteItemQuery, ItemCountQuery } from '../../lib/repository';
import {
    DataTableField, DataTableResponse, DataTableButton, DataTableDeleteResponse,
    Filter, DataTableCountResponse, DynamicFilter, DataTableAvatar
} from './data-table-models';
import { IDataTableField, IDataTableButton } from './data-table.interfaces';
import * as _ from 'underscore';

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

    private config: DataTableConfig;

    private filters: Filter[] = [];

    constructor(
        /**
         * Query
         */
        private query: (search: string) => MultipleItemQuery<TItem>
    ) {
        this.config = new DataTableConfig();
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
        this.config.fields.push(new DataTableField(field.name, field.value));
        return this;
    }

    /**
     * Adds array of fields to list
     * @param fields Fields to add
     */
    withFields(fields: IDataTableField<TItem>[]): this {
        this.config.fields = _.union(this.config.fields, fields.map(m => new DataTableField(m.name, m.value)));
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
                    return dynamicFilter.query(this.query(filterSearch));
                };

                returnfilters.push(
                    new DynamicFilter(
                        dynamicFilter.guid,
                        dynamicFilter.name,
                        (page: number, pageSize: number, xSearch: string, limit: number) => this.getDataResponse(filterQuery, page, pageSize, xSearch, limit),
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
    * Sets up filters
    * @param filters filters
    */
    withFilters(filters: IStaticFilter<TItem>[]): this {
        const returnfilters: Filter[] = [];

        filters.forEach(filter => {
            // resolve filter query using the 'base' query
            const filterQuery = (search) => filter.query(this.query(search));

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
                    (page: number, pageSize: number, search: string, limit: number) => this.getDataResponse(filterQuery, page, pageSize, search, limit),
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
    allFilter(name: Observable<string>): this {
        // resolve filter query using the 'base' query
        const filterQuery = (search) => this.query(search).toCountQuery();

        this.config.allFilter =
            new Filter(
                '_allFilter',
                name,
                (page: number, pageSize: number, search: string, limit: number) => this.getDataResponse(this.query, page, pageSize, search, limit),
                (search) => this.getCountResponse(filterQuery, search),
                1
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
     * Gets the data table config
     */
    build(): DataTableConfig {
        // assign observable
        this.config.getData = (page: number, pageSize: number, search: string, limit: number) => this.getDataResponse(this.query, page, pageSize, search, limit);
        return this.config;
    }

    private getCountResponse(inputQuery: (search) => ItemCountQuery, search: string): Observable<DataTableCountResponse> {
        const query = inputQuery(search);

        return query.get()
            .map(response => {
                return new DataTableCountResponse(response.count);
            });
    }

    private getDataResponse(inputQuery: (search) => MultipleItemQuery<TItem>, page: number, pageSize: number, search: string, limit: number): Observable<DataTableResponse> {
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

        return query.get().map(response => new DataTableResponse(response.items, response.totalItems));
    }
}
