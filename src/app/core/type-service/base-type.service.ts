import { RepositoryService } from '../../repository/repository.service';
import { IService } from './iservice.class';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.class';

import { IItem } from '../../repository/interfaces/iitem.interface';
import { IOption } from '../../repository/interfaces/ioption.interface';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/models/responses';

export abstract class BaseTypeService<TItem extends IItem> implements IService<TItem>{

    constructor(
        protected repositoryService: RepositoryService,
        public type: string
    ) { }

    getMultiple(action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        return this.repositoryService.getItems(this.type, action, options);
    }

    getAll(options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        return this.repositoryService.getItems(this.type, 'getall', options);
    }

    getSingle(action: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getItem(this.type, action, options);
    }

    getByCodename(codename: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getItem(this.type, 'getbycodename/' + codename, options);
    }

    getByGuid(guid: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getItem(this.type, 'getbyguid/' + guid, options);
    }

    getById(id: number, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getItem(this.type, 'getbyid/' + id, options);
    }

    create(obj: TItem): Observable<ResponseCreate<TItem>> {
        return this.repositoryService.create(this.type, 'create', obj);
    }

    createCustom(action: string, obj: TItem): Observable<ResponseCreate<TItem>> {
        return this.repositoryService.create(this.type, action, obj);
    }

    edit(obj: TItem): Observable<ResponseEdit<TItem>> {
        return this.repositoryService.edit(this.type, 'edit', obj);
    }

    editCustom(action: string, obj: TItem): Observable<ResponseEdit<TItem>> {
        return this.repositoryService.edit(this.type, action, obj);
    }

    delete(id: number): Observable<ResponseDelete> {
        return this.repositoryService.delete(this.type, 'delete/' + id);
    }
}