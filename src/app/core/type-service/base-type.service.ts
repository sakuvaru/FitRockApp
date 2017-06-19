import { IService } from './iservice.class';
import { Observable } from 'rxjs/Observable';

import {
    RepositoryClient, IItem, SingleItemQueryInit, MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery,
    EditFormQuery, InsertFormQuery
} from '../../../lib/repository';

import { DynamicFormEditBuilder, DynamicFormInsertBuilder } from '../../../lib/web-components';

export abstract class BaseTypeService<TItem extends IItem> implements IService<TItem>{

    constructor(
        protected repositoryClient: RepositoryClient,
        public type: string
    ) { }

    items(): MultipleItemQuery<TItem> {
        return this.repositoryClient.items<TItem>(this.type)
    }

    item(): SingleItemQueryInit<TItem> {
        return this.repositoryClient.item(this.type);
    }

    create(item: TItem): CreateItemQuery<TItem> {
        return this.repositoryClient.create<TItem>(this.type, item);
    }

    edit(item: TItem): EditItemQuery<TItem> {
        return this.repositoryClient.edit<TItem>(this.type, item);
    }

    delete(itemId: number): DeleteItemQuery {
        return this.repositoryClient.delete(this.type, itemId);
    }

    insertForm(): Observable<DynamicFormInsertBuilder<TItem>> {
        return this.repositoryClient.insertForm(this.type)
            .get()
            .map(form => {
                var builder = new DynamicFormInsertBuilder<TItem>();
                builder.fields(form.fields);

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

                builder.fields(form.fields);

                // set default save function
                builder.editFunction((item) => this.edit(item).set());

                // set default button text for update
                builder.submitTextKey('form.shared.save');

                return builder;
            })
    }
}