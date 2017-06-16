import { IService } from './iservice.class';
import { Observable } from 'rxjs/Observable';

import {
    RepositoryClient, IItem, SingleItemQueryInit, MultipleItemQuery, CreateItemQuery, EditItemQuery, DeleteItemQuery
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

    create(item: TItem): CreateItemQuery<TItem> {
        return this.repositoryClient.create<TItem>(this.type, item);
    }

    edit(item: TItem): EditItemQuery<TItem>{
        return this.repositoryClient.edit<TItem>(this.type, item);
    }

    delete(itemId: number): DeleteItemQuery{
        return this.repositoryClient.delete(this.type, itemId);
    }
}