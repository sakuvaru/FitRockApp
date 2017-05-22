import { RepositoryService } from '../../repository/repository.service';
import { IItem } from '../../repository/iitem.class';
import { IService } from './iservice.class';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/responses';
import { IOption } from '../../repository/ioption.class';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user.class';
export abstract class BaseService<TItem extends IItem> implements IService<TItem>{

    constructor(protected repositoryService: RepositoryService, public type: string) { }

    // each service class needs to be responsible for creating proper type of objects 
    // because returning 'item as TItem' will not convert actual object to type
    abstract createEmptyItem<TItem extends IItem>(): TItem;

    protected mapItem(item: IItem): TItem {
        if (!item) {
            return null;
        }

        // create new item of proper type
        var typedItem = this.createEmptyItem<TItem>();

        // assign all properties
        Object.assign(typedItem, item);

        return typedItem;
    }

    protected mapCreate(response: ResponseCreate<TItem>): ResponseCreate<TItem> {
        var item = this.mapItem(response.item);

        response.item = item;

        return response;
    }

    protected mapEdit(response: ResponseEdit<TItem>): ResponseEdit<TItem> {
        var item = this.mapItem(response.item);

        response.item = item;

        return response;
    }

    protected mapDelete(response: ResponseDelete): ResponseDelete {
        return response;
    }

    protected mapGetSingle(response: ResponseSingle<TItem>): ResponseSingle<TItem> {
        var item = this.mapItem(response.item);

        response.item = item;

        return response;
    }

    protected mapGetMultiple(response: ResponseMultiple<TItem>): ResponseMultiple<TItem> {
        var that = this;
        var items = response.items.map(function (item) {
            return that.mapItem(item);
        });

        response.items = items;

        return response;
    }

    getMultiple(action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        return this.repositoryService.getMultiple<TItem>(this.type, action, options).map(response => this.mapGetMultiple(response));
    }

    getSingle(action: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getSingle<TItem>(this.type, action, options).map(response => this.mapGetSingle(response));
    }

    getAll(options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        return this.repositoryService.getAll<TItem>(this.type, options).map(response => this.mapGetMultiple(response));
    }

    getByCodename(codename: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getByCodename<TItem>(this.type, codename, options).map(response => this.mapGetSingle(response));
    }

    getByGuid(guid: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getByGuid<TItem>(this.type, guid, options).map(response => this.mapGetSingle(response));
    }

    getById(id: number, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return this.repositoryService.getById<TItem>(this.type, id, options).map(response => this.mapGetSingle(response));
    }

    create(obj: TItem): Observable<ResponseCreate<TItem>> {
        return this.repositoryService.create<TItem>(this.type, obj).map(response => this.mapCreate(response));
    }

    edit(obj: TItem): Observable<ResponseEdit<TItem>> {
        return this.repositoryService.edit<TItem>(this.type, obj).map(response => this.mapEdit(response));
    }

    delete(id: number): Observable<ResponseDelete> {
        return this.repositoryService.delete(this.type, id).map(response => this.mapDelete(response));
    }
}