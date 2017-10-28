import { Observable } from 'rxjs/Observable';
import { BaseTypeServiceConfig } from './base-type-service.config';

import {
    ItemCountQuery, PostQuery, RepositoryClient, IItem, SingleItemQueryInit,
    MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery, SingleFileQuery, MultipleFileQuery,
    EditFormQuery, InsertFormQuery, TouchKeyQuery, CacheKeyType, SingleItemQueryInitCustom, MultipleItemQueryCustom,
    DeleteFileQuery, ItemsOrderQuery
} from '../../../lib/repository';

import { DynamicFormEditBuilder, DynamicFormInsertBuilder } from '../../../web-components/dynamic-form';

export abstract class BaseTypeService<TItem extends IItem> {

    public type: string;

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

    create(item: TItem): CreateItemQuery<TItem> {
        return this.repositoryClient.create<TItem>(this.type, item);
    }

    edit(item: TItem): EditItemQuery<TItem> {
        return this.repositoryClient.edit<TItem>(this.type, item);
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

    /* --------------------- Form queries ------------------------- */

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

    /**
     * Gets insert form builder
     * @param customQuery Query used to get form definition from server, if none is provided a default one is used
     */
    insertForm(customQuery?: InsertFormQuery<TItem>): DynamicFormInsertBuilder<TItem> {
        // query used to get form definition from server
        const query = customQuery ? customQuery : this.insertFormQuery();

        return new DynamicFormInsertBuilder<TItem>(
            this.type, query.get(),
            (item) => this.create(item).set())
            .submitTextKey('form.shared.insert');
    }

    /**
    * Gets edit form builder
    * @param customQuery Query used to get form definition from server
    */
    editForm(customQuery: EditFormQuery<TItem>): DynamicFormEditBuilder<TItem>;
     /**
    * Gets edit form builder
    * @param itemId Id of the item to edit
    */
    editForm(itemId: number): DynamicFormEditBuilder<TItem>;
    editForm(x: EditFormQuery<TItem> | number, customQuery?: EditFormQuery<TItem>): DynamicFormEditBuilder<TItem> {
        // query used to get form definition from server
        let query;
        if (x instanceof EditFormQuery) {
            query = x;
        }   
        
        if (x instanceof Number) {
            query = this.editFormQuery(x);
        }

        if (!query) {
            throw Error('Could not get edit query for edit form');
        }

        const builder = new DynamicFormEditBuilder<TItem>(this.type, query.get(), (item) => this.edit(item).set());

        // set default delete function if its enabled
        if (this.config.allowDelete) {
            builder.deleteFunction((item) => this.delete(item.Id).set());
        }

        // set default button text for update
        builder.submitTextKey('form.shared.save');

        return builder;
    }
}
