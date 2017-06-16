import { Observable } from 'rxjs/Observable';

import {
    RepositoryClient, IItem, SingleItemQueryInit, MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery
} from '../../../lib/repository';

export interface IService<TItem extends IItem> {

    type: string

    items(): MultipleItemQuery<TItem>;

    item(): SingleItemQueryInit<TItem>;

    create(item: TItem): CreateItemQuery<TItem>;

    edit(item: TItem): EditItemQuery<TItem>;

    delete(itemId: number): DeleteItemQuery;
}