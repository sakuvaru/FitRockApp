import { RepositoryService } from '../../repository/repository.service';
import { IItem } from '../../repository/iitem.class';
import { IService } from './iservice.class';
import { ResponseDelete } from '../../repository/response-delete.class';
import { ResponseEdit } from '../../repository/response-edit.class';
import { ResponseCreate } from '../../repository/response-create.class';
import { ResponseSingle } from '../../repository/response-single.class';
import { ResponseMultiple } from '../../repository/response-multiple.class';
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

    protected mapCreate(response: ResponseCreate): TItem {
        return this.mapItem(response.item);
    }

    protected mapEdit(response: ResponseEdit): TItem {
        return this.mapItem(response.item);
    }

    protected mapDelete(response: ResponseDelete): boolean {
        if (response.result === 200) {
            return true;
        }
        return false;
    }

    protected mapGetSingle(response: ResponseSingle): TItem {
        return this.mapItem(response.item);
    }

    protected mapGetMultiple(response: ResponseMultiple): TItem[] {
        var that = this;
        return response.items.map(function (item) {
            return that.mapItem(item);
        });
    }

    getMultiple(action: string, options?: IOption[]): Observable<TItem[]> {
        return this.repositoryService.getMultiple(this.type, action, options).map(response => this.mapGetMultiple(response));
    }

    getSingle(action: string, options?: IOption[]): Observable<TItem> {
        return this.repositoryService.getSingle(this.type, action, options).map(response => this.mapGetSingle(response));
    }

    getAll(options?: IOption[]): Observable<TItem[]> {
        return this.repositoryService.getAll(this.type, options).map(response => this.mapGetMultiple(response));
    }

    getByCodename(codename: string, options?: IOption[]): Observable<TItem> {
        return this.repositoryService.getByCodename(this.type, codename, options).map(response => this.mapGetSingle(response));
    }

    getByGuid(guid: string, options?: IOption[]): Observable<TItem> {
        return this.repositoryService.getByGuid(this.type, guid, options).map(response => this.mapGetSingle(response));
    }

    getById(id: number, options?: IOption[]): Observable<TItem> {
        return this.repositoryService.getById(this.type, id, options).map(response => this.mapGetSingle(response));
    }

    create(obj: TItem): Observable<TItem> {
        return this.repositoryService.create(this.type, obj).map(response => this.mapCreate(response));
    }

    edit(obj: TItem): Observable<TItem> {
        return this.repositoryService.edit(this.type, obj).map(response => this.mapEdit(response));
    }

    delete(id: number): Observable<boolean> {
        return this.repositoryService.delete(this.type, id).map(response => this.mapDelete(response));
    }
}