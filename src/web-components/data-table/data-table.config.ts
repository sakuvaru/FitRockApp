import { Observable } from 'rxjs/Rx';

import { stringHelper } from '../../lib/utilities';
import {
    AllFilter,
    DataTableAvatar,
    DataTableButton,
    DataTableDeleteResponse,
    DataTableField,
    DataTableResponse,
    DynamicFilter,
    DataTableThumbWidth
} from './data-table-models';
import { IDataTableSort, IFilter } from './data-table.interfaces';
import { DataTableMode } from './data-table-mode.enum';

export class DataTableConfig {

    /**
     * Indicates if data table is wrapped in a card like box
     */
    public wrapInCard: boolean = false;

    /**
     * Hash stored so that its not calculated each time its accessed
     */
    private _hash?: number;

    /**
     * Title of the data table
     */
    public title?: Observable<string>;

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
     * Indicates if search is enabled (search filter shown)
     */
    public enableSearch = true;

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

    /**
     * Page size options
     */
    public pageSizeOptions: number[] = [5, 10, 25, 50, 100];

    /**
     * Indicates if pager is rendered
     */
    public renderPager: boolean = true;

    /**
     * Width of thumb in %
     */
    public thumbWidth?: DataTableThumbWidth;

    /**
     * Data table mode.
     * Tiles mode is a simple mode that displays only item's name (first column or the result defined by itemName property)
     * and/or image
     */
    public mode: DataTableMode = DataTableMode.Standard;

    constructor(
        /**
         * data
         */
        public getData?: (page: number, pageSize: number, search: string, limit?: number, sort?: IDataTableSort) => Observable<DataTableResponse>,
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
