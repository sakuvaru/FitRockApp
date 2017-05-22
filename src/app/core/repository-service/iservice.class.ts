import { IItem } from '../../repository/iitem.class';
import { IOption } from '../../repository/ioption.class';
import { Observable } from 'rxjs/Observable';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/responses';

export interface IService<TItem extends IItem> {

    type: string

    // each service class needs to be responsible for creating proper type of objects 
    // because returning 'item as TItem' will not convert actual object to type
    createEmptyItem<TItem extends IItem>(): TItem;

    getMultiple(action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>>;

    getSingle(action: string, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    getAll(options?: IOption[]): Observable<ResponseMultiple<TItem>>;

    getByCodename(codename: string, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    getByGuid(guid: string, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    getById(id: number, options?: IOption[]): Observable<ResponseSingle<TItem>>;

    create(obj: TItem): Observable<ResponseCreate<TItem>>;

    edit(obj: TItem): Observable<ResponseEdit<TItem>>;

    delete(id: number): Observable<ResponseDelete>;
}