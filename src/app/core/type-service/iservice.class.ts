import { Observable } from 'rxjs/Observable';

import {
    IItem, IOption, ResponseDelete, ResponseCreate,
    ResponseEdit, ResponseMultiple, ResponseSingle
} from '../../../lib/repository';

export interface IService<TItem extends IItem> {

    type: string

    getMultiple(action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>>;

    getSingle(action: string, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    getAll(options?: IOption[]): Observable<ResponseMultiple<TItem>>;

    getByCodename(codename: string, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    getByGuid(guid: string, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    getById(id: number, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    create(obj: TItem): Observable<ResponseCreate<TItem>>;

    createCustom(action: string, obj: TItem): Observable<ResponseCreate<TItem>>

    edit(obj: TItem): Observable<ResponseEdit<TItem>>;

    editCustom(action: string, obj: TItem): Observable<ResponseEdit<TItem>>

    delete(id: number): Observable<ResponseDelete>;
}