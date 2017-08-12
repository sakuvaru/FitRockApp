import { Observable } from 'rxjs/Observable';
import { BaseTypeServiceConfig } from './base-type-service.config';

import {
    ItemCountQuery, PostQuery, RepositoryClient, IItem, SingleItemQueryInit, MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery,
    EditFormQuery, InsertFormQuery, TouchKeyQuery, CacheKeyType, SingleItemQueryInitCustom, MultipleItemQueryCustom
} from '../../../lib/repository';

import { DynamicFormEditBuilder, DynamicFormInsertBuilder } from '../../../web-components/dynamic-form';

export abstract class BaseTypeService<TItem extends IItem>{

    public type: string;

    constructor(
        protected repositoryClient: RepositoryClient,
        public config: BaseTypeServiceConfig
    ) {
        this.type = config.type;
    }

    items(): MultipleItemQuery<TItem> {
        return this.repositoryClient.items<TItem>(this.type)
    }

    customItems<TAny>(): MultipleItemQueryCustom<TAny> {
        return this.repositoryClient.customItems<TAny>(this.type)
    }

    item(): SingleItemQueryInit<TItem> {
        return this.repositoryClient.item<TItem>(this.type);
    }

    customItem<TAny>(): SingleItemQueryInitCustom<TAny> {
        return this.repositoryClient.customItem<TAny>(this.type);
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

    post<TAny extends any>(action: string): PostQuery<TAny> {
        return this.repositoryClient.post<TAny>(this.type, action);
    }

    touchKey<TAny extends any>(cackeKeyType: CacheKeyType, itemId?: number): TouchKeyQuery {
        return this.repositoryClient.touchKey(this.type, cackeKeyType, itemId);
    }

    updateItemsOrder(orderedItems: TItem[], distinguishByValue: number): PostQuery<any> {
        return this.repositoryClient.updateItemsOrder(this.type, orderedItems, distinguishByValue);
    }

    delete(itemId: number): DeleteItemQuery {
        if (!this.config.allowDelete) {
            throw Error(`Delete is not allowed for type '${this.type}'`);
        }
        return this.repositoryClient.delete(this.type, itemId);
    }

    insertForm(): Observable<DynamicFormInsertBuilder<TItem>> {
        return this.repositoryClient.insertForm(this.type)
            .get()
            .map(form => {
                var builder = new DynamicFormInsertBuilder<TItem>();

                // set fields
                builder.fields(form.fields);

                // set type of form
                builder.type(form.type);

                // set default save function
                builder.insertFunction((item) => this.create(item).set())

                // set default button text for insert
                builder.submitTextKey('form.shared.insert');

                return builder;
            })
    }

    editForm(itemId: number): Observable<DynamicFormEditBuilder<TItem>> {
        return this.repositoryClient.editForm(this.type, itemId)
            .get()
            .map(form => {
                var builder = new DynamicFormEditBuilder<TItem>();

                // set type of form
                builder.type(form.type);

                // set returned item
                builder.setItem(form.item as TItem);

                // set fields
                builder.fields(form.fields);

                // set default delete function if its enabled
                if (this.config.allowDelete) {
                    builder.deleteFunction((item) => this.delete(item.Id).set());
                }

                // set default save function
                builder.editFunction((item) => this.edit(item).set());

                // set default button text for update
                builder.submitTextKey('form.shared.save');

                return builder;
            })
    }
}