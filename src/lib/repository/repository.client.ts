import { QueryService } from './services/query.service';
import { IItem } from './interfaces/iitem.interface';
import { AuthHttp } from 'angular2-jwt';
import { RepositoryConfig } from './repository.config';
import { SingleItemQueryInit } from './queries/get/single-item-query.class';
import { SingleItemQueryInitCustom } from './queries/get/single-item-query-custom.class';
import { MultipleItemQuery } from './queries/get/multiple-item-query.class';
import { MultipleItemQueryCustom } from './queries/get/multiple-item-query-custom.class';
import { CreateItemQuery } from './queries/manage/create-item-query.class';
import { EditItemQuery } from './queries/manage/edit-item-query.class';
import { DeleteItemQuery } from './queries/manage/delete-item-query.class';
import { ErrorResponse } from './models/responses';
import { CacheKeyType } from './models/cache-key-type';
import { InsertFormQuery } from './queries/form/insert-form-query.class';
import { EditFormQuery } from './queries/form/edit-form-query.class';
import { PostQuery } from './queries/general/post-query.class';
import { TouchKeyQuery } from './queries/general/touch-key-query.class';
import { OrderItem, UpdateItemsRequest } from './models/update-items-request.class';

// rxjs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class RepositoryClient {

    private queryService: QueryService;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        this.queryService = new QueryService(this.authHttp, this.config);
    }

    items<TItem extends IItem>(type: string): MultipleItemQuery<TItem> {
        return new MultipleItemQuery<TItem>(this.authHttp, this.config, type);
    }

    customItems<TAny>(type: string): MultipleItemQueryCustom<TAny> {
        return new MultipleItemQueryCustom<TAny>(this.authHttp, this.config, type);
    }

    item<TItem extends IItem>(type: string): SingleItemQueryInit<TItem> {
        return new SingleItemQueryInit<TItem>(this.authHttp, this.config, type);
    }

    customItem<TAny>(type: string): SingleItemQueryInitCustom<TAny> {
        return new SingleItemQueryInitCustom<TAny>(this.authHttp, this.config, type);
    }

    create<TItem extends IItem>(type: string, item: TItem): CreateItemQuery<TItem> {
        return new CreateItemQuery(this.authHttp, this.config, type, item);
    }

    edit<TItem extends IItem>(type: string, item: TItem): EditItemQuery<TItem> {
        return new EditItemQuery(this.authHttp, this.config, type, item);
    }

    updateItemsOrder<TItem extends IItem>(type: string, orderedItems: TItem[], distinguishByValue: number): PostQuery<any> {
        var action = 'updateItemsOrder';
        var updateRequest = new UpdateItemsRequest(distinguishByValue, this.getItemsOrderJson(orderedItems));
        return new PostQuery(this.authHttp, this.config, type, action).withJsonData(updateRequest);
    }

    post<T extends any>(type: string, action: string): PostQuery<T> {
        return new PostQuery(this.authHttp, this.config, type, action);
    }

    touchKey(type: string, cacheKeyType: CacheKeyType, itemId?: number): TouchKeyQuery {
        return new TouchKeyQuery(this.authHttp, this.config, type, cacheKeyType, itemId);
    }

    delete<TItem extends IItem>(type: string, itemId: number): DeleteItemQuery {
        return new DeleteItemQuery(this.authHttp, this.config, type, itemId);
    }

    insertForm<TItem extends IItem>(type: string): InsertFormQuery<TItem> {
        return new InsertFormQuery<TItem>(this.authHttp, this.config, type);
    }

    editForm<TItem extends IItem>(type: string, itemId: number): EditFormQuery<TItem> {
        return new EditFormQuery<TItem>(this.authHttp, this.config, type, itemId);
    }

    mergeObservables(observables: Observable<any>[]): Observable<any> {
        return this.queryService.mergeObservables(observables);
    }

    private getItemsOrderJson<TItem extends IItem>(orderedItems: TItem[]): OrderItem[] {
        var data: OrderItem[] = [];
        if (orderedItems) {
            for (var i = 0; i < orderedItems.length; i++) {
                var orderItem = orderedItems[i];
                data.push(new OrderItem(orderItem.id, i));
            }
        }
        return data;
    }
}


