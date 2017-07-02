import { Observable } from 'rxjs/Observable';

import {
    RepositoryClient, IItem, SingleItemQueryInit, MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery,
    EditFormQuery, InsertFormQuery
} from '../../../lib/repository';

import { DynamicFormEditBuilder, DynamicFormInsertBuilder } from '../../../web-components/dynamic-form';

export interface IService<TItem extends IItem> {

    type: string;

    items(): MultipleItemQuery<TItem>;

    item(): SingleItemQueryInit<TItem>;

    create(item: TItem): CreateItemQuery<TItem>;

    edit(item: TItem): EditItemQuery<TItem>;

    delete(itemId: number): DeleteItemQuery;

    insertForm(): Observable<DynamicFormInsertBuilder<TItem>>;

    editForm(itemId: number): Observable<DynamicFormEditBuilder<TItem>>;
}