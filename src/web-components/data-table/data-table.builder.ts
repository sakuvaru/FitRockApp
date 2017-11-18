import { DataTableConfig } from './data-table.config';
import { Observable } from 'rxjs/Rx';
import { IItem, MultipleItemQuery, DeleteItemQuery } from '../../lib/repository';
import { DataTableField, DataTableResponse, DataTableButton, DataTableDeleteResponse } from './data-table-models';
import { IDataTableField, IDataTableButton } from './data-table.interfaces';
import * as _ from 'underscore';

export class DataTableBuilder<TItem extends IItem> {

    private config: DataTableConfig;

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
    deleteAction(resolver: (item: TItem) => DeleteItemQuery): this {
        this.config.deleteAction = (item) => resolver(item)
            .set()
            .map(response => new DataTableDeleteResponse(true))
            .catch(err => {
                console.log(err);
                return Observable.throw(new DataTableDeleteResponse(false, err));
            });
        return this;
    }

    /**
     * Gets the data table config
     */
    build(): DataTableConfig {
        // assign observable
        this.config.getData = (page: number, pageSize: number, search: string, limit: number) => this.getDataFunction(page, pageSize, search, limit);
        return this.config;
    }

    private getDataFunction(page: number, pageSize: number, search: string, limit: number): Observable<DataTableResponse> {
        const query = this.query(search);

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
