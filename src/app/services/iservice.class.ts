import { IItem } from '../repository/iitem.class';
import { IOption } from '../repository/ioption.class';
import { Observable } from 'rxjs/Observable';

export interface IService<T extends IItem> {
    
    type: string

    getAll(options?: IOption[]): Observable<T[]>;

    getByCodename(codename: string, options?: IOption[]): Observable<T>;

    getByGuid(guid: string, options?: IOption[]): Observable<T>;

    getById(id: number, options?: IOption[]): Observable<T>;
}