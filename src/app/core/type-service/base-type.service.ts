import { IService } from './iservice.class';
import { Observable } from 'rxjs/Observable';

import {
    RepositoryClient, IItem, IOption, ResponseDelete,
    ResponseCreate, ResponseEdit, SingleItemQueryInit, MultipleItemQuery
} from '../../../lib/repository';

export abstract class BaseTypeService<TItem extends IItem> implements IService<TItem>{

    constructor(
        protected repositoryClient: RepositoryClient,
        public type: string
    ) { }

    items(): MultipleItemQuery<TItem> {
        return this.repositoryClient.items<TItem>(this.type)
    }

    item(): SingleItemQueryInit<TItem> {
        return this.repositoryClient.item(this.type);
    }

    create(obj: TItem): Observable<ResponseCreate<TItem>> {
        return this.repositoryClient.create(this.type, 'create', obj);
    }

    createCustom(action: string, obj: TItem): Observable<ResponseCreate<TItem>> {
        return this.repositoryClient.create(this.type, action, obj);
    }

    edit(obj: TItem): Observable<ResponseEdit<TItem>> {
        return this.repositoryClient.edit(this.type, 'edit', obj);
    }

    editCustom(action: string, obj: TItem): Observable<ResponseEdit<TItem>> {
        return this.repositoryClient.edit(this.type, action, obj);
    }

    delete(id: number): Observable<ResponseDelete> {
        return this.repositoryClient.delete(this.type, 'delete/' + id);
    }
}