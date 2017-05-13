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

export abstract class BaseService<T extends IItem> implements IService<T>{

    constructor(protected repositoryService: RepositoryService, public type: string) { }

    protected mapItem(item: any): T {
        if (!item) {
            return null;
        }

        return item as T;
    }

    protected mapCreate(response: ResponseCreate): T {
        return this.mapItem(response.item);
    }

    protected mapEdit(response: ResponseEdit): T {
        return this.mapItem(response.item);
    }

     protected mapDelete(response: ResponseDelete): boolean {
        if (response.result === 200){
            return true;
        }
        return false;
    }

    protected mapGetSingle(response: ResponseSingle): T {
        return this.mapItem(response.item);
    }

    protected mapGetMultiple(response: ResponseMultiple): T[] {
        var that = this;
        return response.items.map(function (item) {
            return that.mapItem(item);
        });
    }

    getAll(options?: IOption[]): Observable<T[]> {
        return this.repositoryService.getAll(this.type, options).map(response => this.mapGetMultiple(response));
    }

    getByCodename(codename: string, options?: IOption[]): Observable<T> {
        return this.repositoryService.getByCodename(this.type, codename, options).map(response => this.mapGetSingle(response));
    }

    getByGuid(guid: string, options?: IOption[]): Observable<T> {
        return this.repositoryService.getByGuid(this.type, guid, options).map(response => this.mapGetSingle(response));
    }

    getById(id: number, options?: IOption[]): Observable<T> {
        return this.repositoryService.getById(this.type, id, options).map(response => this.mapGetSingle(response));
    }

    create(obj: T): Observable<T> {
        return this.repositoryService.create(this.type, obj).map(response => this.mapCreate(response));
    }

    edit(obj: T): Observable<T> {
        return this.repositoryService.edit(this.type, obj).map(response => this.mapEdit(response));
    }
    
    delete(id: number): Observable<boolean> {
        return this.repositoryService.delete(this.type, id).map(response => this.mapDelete(response));
    }
}