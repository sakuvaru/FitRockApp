import { IItem } from './repository/iitem.class';
import { IOption } from './repository/ioption.class';

export interface IService<T extends IItem> {
    type: string

    getAll(options?: IOption[]): Promise<T[]>;

    getByCodename(codename: string, options?: IOption[]): Promise<T>;

    getByGuid(guid: string, options?: IOption[]): Promise<T>;

    getById(id: number, options?: IOption[]): Promise<T>;
}