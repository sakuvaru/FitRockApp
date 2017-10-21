// models
import { IItem } from './interfaces/iitem.interface';
import { RepositoryConfig } from './repository.config';
import { CacheKeyType } from './models/cache-key-type';
import { ControllerModel } from './models/controller-model.class';

// services
import { AuthHttp } from 'angular2-jwt';

// queries
import { SingleItemQueryInit } from './queries/item/single-item-query.class';
import { SingleItemQueryInitCustom } from './queries/item/single-item-query-custom.class';
import { MultipleItemQuery } from './queries/item/multiple-item-query.class';
import { MultipleItemQueryCustom } from './queries/item/multiple-item-query-custom.class';
import { CreateItemQuery } from './queries/manage/create-item-query.class';
import { EditItemQuery } from './queries/manage/edit-item-query.class';
import { DeleteItemQuery } from './queries/manage/delete-item-query.class';
import { ItemCountQuery } from './queries/count/item-count-query.class';
import { ErrorResponse } from './models/responses';
import { InsertFormQuery } from './queries/form/insert-form-query.class';
import { EditFormQuery } from './queries/form/edit-form-query.class';
import { PostQuery } from './queries/generic/post-query.class';
import { TouchKeyQuery } from './queries/misc/touch-key-query.class';
import { UploadSingleQuery } from './queries/file/upload-single-query.class';
import { UploadMultipleQuery } from './queries/file/upload-multiple-query.class';
import { MultipleFileQuery } from './queries/file/multiple-file-query.class';
import { SingleFileQuery } from './queries/file/single-file-query.class';
import { DeleteFileQuery } from './queries/file/delete-file-query.class';
import { ItemsOrderQuery } from './queries/order/items-order-query.class';
import { GetQuery } from './queries/generic/get-query.class';


export class RepositoryClient {

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
    }

    /* ------------ Item queries ---------- */

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

    count<TItem extends IItem>(type: string): ItemCountQuery {
        return new ItemCountQuery(this.authHttp, this.config, type);
    }

    updateItemsOrder<TItem extends IItem>(type: string, orderedItems: TItem[], distinguishByValue: number): ItemsOrderQuery<TItem> {
        return new ItemsOrderQuery(this.authHttp, this.config, type, orderedItems, distinguishByValue);
    }

    get<TAny>(controller: ControllerModel): GetQuery<TAny>;
    get<TAny>(controller: string, action: string): GetQuery<TAny>;
    get<TAny>(controllerOrName: string | ControllerModel, action?: string): GetQuery<TAny> {
        if (controllerOrName instanceof String && action) {
            return new GetQuery(this.authHttp, this.config, controllerOrName, action);
        }
        if (controllerOrName instanceof ControllerModel) {
            return new GetQuery(this.authHttp, this.config, controllerOrName.controller, controllerOrName.action);
        }
        throw Error(`Unsupported overload`);
    }

    post<TAny>(type: string, action: string): PostQuery<TAny> {
        return new PostQuery(this.authHttp, this.config, type, action);
    }

    touchKey(type: string, cacheKeyType: CacheKeyType, itemId?: number): TouchKeyQuery {
        return new TouchKeyQuery(this.authHttp, this.config, type, cacheKeyType, itemId);
    }

    delete<TItem extends IItem>(type: string, itemId: number): DeleteItemQuery {
        return new DeleteItemQuery(this.authHttp, this.config, type, itemId);
    }

    /* --------------- Form queries ------------- */

    insertForm<TItem extends IItem>(type: string): InsertFormQuery<TItem> {
        return new InsertFormQuery<TItem>(this.authHttp, this.config, type);
    }

    editForm<TItem extends IItem>(type: string, itemId: number): EditFormQuery<TItem> {
        return new EditFormQuery<TItem>(this.authHttp, this.config, type, itemId);
    }

    /* ------------ File queries ---------- */

    singleFile(controller: string, action: string): SingleFileQuery {
        return new SingleFileQuery(this.authHttp, this.config, controller, action);
    }

    multipleFiles(controller: string, action: string): MultipleFileQuery {
        return new MultipleFileQuery(this.authHttp, this.config, controller, action);
    }

    deleteFile(controller: string, action: string, fileUrl: string): DeleteFileQuery {
        return new DeleteFileQuery(this.authHttp, this.config, action, controller, fileUrl);
    }

    uploadSingleFile(controller: string, action: string, file: File): UploadSingleQuery {
        return new UploadSingleQuery(this.authHttp, this.config, controller, action, file);
    }

    uploadMultipleFiles(controller: string, action: string, files: File[]): UploadMultipleQuery {
        return new UploadMultipleQuery(this.authHttp, this.config, controller, action, files);
    }
}


