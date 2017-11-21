import { Observable } from 'rxjs/Rx';
import {
    DataTableField, DataTableResponse, DataTableButton,
    DataTableDeleteResponse, DynamicFilter, AllFilter, DataTableAvatar
} from './data-table-models';
import { IFilter } from './data-table.interfaces';
import { guidHelper, stringHelper } from '../../lib/utilities';

export class DataTableConfig {

    /**
     * Hash stored so that its not calculated each time its accessed
     */
    private _hash?: number;

    /**
     * Fields
     */
    public fields: DataTableField<any>[] = [];

    /**
     * Action buttons
     */
    public buttons: DataTableButton<any>[] = [];

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Default limit
     */
    public limit?: number;

    /**
     * Default page
     */
    public page: number = 1;

    /**
     * Default page size
     */
    public pageSize: number = 10;

    /**
     * Delete action
     */
    public deleteAction?: (item) => Observable<DataTableDeleteResponse>;

    /**
     * Used to get name of the item 
     * Can be used for e.g preview of item in delete dialog
     */
    public itemName?: (item) => string;

    /**
     * Filters
     */
    public filters: IFilter[] = [];

    /**
     * Dynamic filters
     */
    public dynamicFilters?: (search: string) => Observable<DynamicFilter[]>;

    /**
     * Indicates if last filter, search & page is remembered
     */
    public rememberState: boolean = true;

    /**
     * Sets up all filter. This filter is applicable only for static filters, not dynamic.
     */
    public allFilter?: AllFilter;

    /**
     * Avatar resolver
     */
    public avatar?: (item: any) => DataTableAvatar;

    /**
     * Url of image to be used if there are no data
     */
    public noDataImageUrl?: string;

    /**
     * On click event
     */
    public onClick?: (item: any) => void;

    constructor(
        /**
         * data
         */
        public getData?: (page: number, pageSize: number, search: string, limit?: number) => Observable<DataTableResponse>,
    ) {
    }

    /**
    * Gets unique hash of the configuration of data list
    */
    getHash(): number {
        if (this._hash) {
            return this._hash;
        }

        const allProperties = Object.getOwnPropertyNames(this);
        let fullText = '';
        allProperties.forEach(property => {
            const propertyValue = this[property];
            if (propertyValue) {
                fullText += property + '=' + propertyValue;
            }
        });

        const hash = stringHelper.getHash(fullText);

        // save hash
        this._hash = hash;

        return hash;
    }
}
