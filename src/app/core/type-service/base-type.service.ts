import { IService } from './iservice.class';
import { Observable } from 'rxjs/Observable';

import {
    RepositoryService, IItem, IOption, ResponseDelete,
    ResponseCreate, ResponseEdit, SingleItemQueryInit, MultipleItemQuery
} from '../../../lib/repository';

export abstract class BaseTypeService<TItem extends IItem> implements IService<TItem>{

    constructor(
        protected repositoryService: RepositoryService,
        public type: string
    ) { }

    items(): MultipleItemQuery<TItem> {
        return this.repositoryService.items<TItem>(this.type)
    }

    item(): SingleItemQueryInit<TItem> {
        return this.repositoryService.item(this.type);
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