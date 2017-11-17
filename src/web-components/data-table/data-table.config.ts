import { Observable } from 'rxjs/Rx';
import { DataTableField, DataTableResponse } from './data-table-models';

export class DataTableConfig {

    /**
     * Fields
     */
    public fields: DataTableField<any>[] = [];

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Default limit
     */
    public limit: number = 1000;

    /**
     * Default page
     */
    public page: number = 1;

    /**
     * Default page size
     */
    public pageSize: number = 10;

    constructor(
        /**
         * data
         */
        public getData: (pageSize: number, page: number, search: string, limit: number) => Observable<DataTableResponse>,
    ) {
    }
}
