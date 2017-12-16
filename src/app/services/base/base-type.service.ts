import { Observable } from 'rxjs/Observable';
import { BaseTypeServiceConfig } from './base-type-service.config';

import {
    ItemCountQuery, PostQuery, RepositoryClient, IItem, SingleItemQueryInit,
    MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery, SingleFileQuery, MultipleFileQuery,
    EditFormQuery, InsertFormQuery, TouchKeyQuery, CacheKeyType, SingleItemQueryInitCustom, MultipleItemQueryCustom,
    DeleteFileQuery, ItemsOrderQuery
} from '../../../lib/repository';

import { numberHelper } from '../../../lib/utilities';

// forms
import { DataFormService } from '../../web-component-services';
import { DataFormBuilder } from '../../../web-components/data-form';

// data tables
import { DataTableService } from '../../web-component-services';
import { DataTableBuilder } from '../../../web-components/data-table';

export abstract class BaseTypeService<TItem extends IItem> {

    public type: string;

    private readonly dataFormService: DataFormService = new DataFormService();
    private readonly dataTableService: DataTableService = new DataTableService();

    constructor(
        protected repositoryClient: RepositoryClient,
        public config: BaseTypeServiceConfig
    ) {
        this.type = config.type;
    }

    /* ------------------- Type related queries -------------------- */

    items(): MultipleItemQuery<TItem> {
        return this.repositoryClient.items<TItem>(this.type);
    }

    item(): SingleItemQueryInit<TItem> {
        return this.repositoryClient.item<TItem>(this.type);
    }

    count(): ItemCountQuery {
        return this.repositoryClient.count(this.type);
    }

    create(formData: Object): CreateItemQuery<TItem> {
        return this.repositoryClient.create<TItem>(this.type, formData);
    }

    edit(formData: Object): EditItemQuery<TItem> {
        return this.repositoryClient.edit<TItem>(this.type, formData);
    }

    delete(itemId: number): DeleteItemQuery {
        if (!this.config.allowDelete) {
            throw Error(`Delete is not allowed for type '${this.type}'`);
        }
        return this.repositoryClient.delete(this.type, itemId);
    }

    touchKey<TAny extends any>(cackeKeyType: CacheKeyType, itemId?: number): TouchKeyQuery {
        return this.repositoryClient.touchKey(this.type, cackeKeyType, itemId);
    }

    updateItemsOrder(orderedItems: TItem[], distinguishByValue: number): ItemsOrderQuery<any> {
        return this.repositoryClient.updateItemsOrder<TItem>(this.type, orderedItems, distinguishByValue);
    }

    /* -------------------- Generic queries ----------------------- */

    customItems<TAny>(): MultipleItemQueryCustom<TAny> {
        return this.repositoryClient.customItems<TAny>(this.type);
    }

    customItem<TAny>(): SingleItemQueryInitCustom<TAny> {
        return this.repositoryClient.customItem<TAny>(this.type);
    }

    post<TAny extends any>(action: string): PostQuery<TAny> {
        return this.repositoryClient.post<TAny>(this.type, action);
    }

    /* --------------------- Form builds ------------------------- */

    /**
     * Builds insert form
     */
    buildInsertForm(
        options?: {
            formDefinitionQuery?: InsertFormQuery<TItem>,
            insertQuery?: (formData: Object) => CreateItemQuery<TItem>
        }
    ): DataFormBuilder<TItem> {
        // query used to get form definition from server
        const formDefinitionQuery = options && options.formDefinitionQuery ? options.formDefinitionQuery : this.insertFormQuery();
        const createQuery = options && options.insertQuery ? options.insertQuery : (item: TItem) => this.create(item);

        return this.dataFormService.insertForm<TItem>(this.type, formDefinitionQuery.get(), (formData) => createQuery(formData).set());
    }

    buildEditForm(
        formDefinitionQuery: EditFormQuery<TItem>,
        onError: (error) => void,
        options?: {
            editQuery?: (formData: Object) => EditItemQuery<TItem>,
            deleteQuery?: (formData: Object) => DeleteItemQuery
        }
    ): DataFormBuilder<TItem>;
    buildEditForm(
        itemId: number,
        onError: (error) => void,
        options?: {
            editQuery?: (formData: Object) => EditItemQuery<TItem>,
            deleteQuery?: (formData: Object) => DeleteItemQuery
        }
    ): DataFormBuilder<TItem>;
    buildEditForm(
        queryOrId: EditFormQuery<TItem> | number,
        onError: (error) => void,
        options?: {
            editQuery?: (formData: Object) => EditItemQuery<TItem>,
            deleteQuery?: (formData: Object) => DeleteItemQuery
        }
    ): DataFormBuilder<TItem> {
        // query used to get form definition from server
        let formQuery: EditFormQuery<TItem> | undefined;
        if (queryOrId instanceof EditFormQuery) {
            formQuery = queryOrId;
        }

        if (numberHelper.isNumber(queryOrId)) {
            formQuery = this.editFormQuery(+queryOrId);
        }

        if (!formQuery) {
            throw Error('Could not process edit query');
        }

        const editQuery = options && options.editQuery ? options.editQuery : (formData: Object) => this.edit(formData);
        const deleteQuery = options && options.deleteQuery ? options.deleteQuery : (formData: Object) => this.delete(formData['Id']);

        return this.dataFormService.editForm<TItem>(this.type, formQuery.get(), (formData) => editQuery(formData).set(), {
            delete: (formData) => deleteQuery(formData).set()
        })
            .onError(onError);
    }

    /* --------------------------- Data table builds ------------------------------- */

    /**
     * Builds data table
     * @param query Query
     */
    buildDataTable(
        query: (query: MultipleItemQuery<TItem>, search: string) => MultipleItemQuery<TItem>,
        options?: {
            enableDelete?: boolean
        }
    ): DataTableBuilder<TItem> {

        const resolvedQuery = (search: string) => query(this.items(), search);

        // build data table
        const dataTable = this.dataTableService.dataTable<TItem>(resolvedQuery);

        const enableDelete = options && options.enableDelete ? true : false;

        if (enableDelete) {
            // configure delete action
            dataTable.deleteAction(item => this.delete(item.id));
        }

        return dataTable;
    }

    /**
     * Query used to save new item
     */
    insertFormQuery(): InsertFormQuery<TItem> {
        return this.repositoryClient.insertForm(this.type);
    }

    /**
     * Query used to edit existing item with given id
     * @param itemId Id of the item
     */
    editFormQuery(itemId: number): EditFormQuery<TItem> {
        return this.repositoryClient.editForm(this.type, itemId);
    }
}
