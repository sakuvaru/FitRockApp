import { Observable } from 'rxjs/Observable';

import {
    IItem, ResponseDelete, ResponseCreate,
    ResponseEdit, SingleItemQueryInit, MultipleItemQuery
} from '../../../lib/repository';

export interface IService<TItem extends IItem> {

    type: string

    items(): MultipleItemQuery<TItem>;

    item(): SingleItemQueryInit<TItem>;

    create(obj: TItem): Observable<ResponseCreate<TItem>>;

    createCustom(action: string, obj: TItem): Observable<ResponseCreate<TItem>>

    edit(obj: TItem): Observable<ResponseEdit<TItem>>;

    editCustom(action: string, obj: TItem): Observable<ResponseEdit<TItem>>

    delete(id: number): Observable<ResponseDelete>;
}