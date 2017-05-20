import { IItem } from '../../repository/iitem.class';
import { IOption } from '../../repository/ioption.class';
import { Observable } from 'rxjs/Observable';

export interface IService<TItem extends IItem> {

    type: string

    // each service class needs to be responsible for creating proper type of objects 
    // because returning 'item as TItem' will not convert actual object to type
    createEmptyItem<TItem extends IItem>(): TItem;

    getAll(options?: IOption[]): Observable<TItem[]>;

    getByCodename(codename: string, options?: IOption[]): Observable<TItem>;

    getByGuid(guid: string, options?: IOption[]): Observable<TItem>;

    getById(id: number, options?: IOption[]): Observable<TItem>;

    edit(obj: TItem): Observable<TItem>;

    delete(id: number): Observable<boolean>;

    create(obj: TItem): Observable<TItem>;
    
    delete(id: number): Observable<boolean>
}