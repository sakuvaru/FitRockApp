import { RepositoryService } from '../repository/repository.service';
import { IItem } from '../repository/iitem.class';
import { IService } from './iservice.class';
import { ResponseSingle } from '../repository/response-single.class';
import { ResponseMultiple } from '../repository/response-multiple.class';
import { IOption } from '../repository/ioption.class';
import { Observable } from 'rxjs/Observable';

export abstract class BaseService<T extends IItem> implements IService<T>{

    constructor(protected repositoryService: RepositoryService, public type: string) { }

    protected mapItem(item: any): T {
        if (!item) {
            return null;
        }

        return item as T;
    }

    protected mapSingle(response: ResponseSingle): T {
        return this.mapItem(response.item);
    }

    protected mapMultiple(response: ResponseMultiple): T[] {
        var that = this;
        return response.items.map(function (item) {
            return that.mapItem(item);
        });
    }

    getAll(options?: IOption[]): Observable<T[]> {
        return this.repositoryService.getAll(this.type, options).map(response => this.mapMultiple(response));
    }

    getByCodename(codename: string, options?: IOption[]): Observable<T> {
        return this.repositoryService.getByCodename(this.type, codename, options).map(response => this.mapSingle(response));
    }

    getByGuid(guid: string, options?: IOption[]): Observable<T> {
        return this.repositoryService.getByGuid(this.type, guid, options).map(response => this.mapSingle(response));
    }

    getById(id: number, options?: IOption[]): Observable<T> {
        return this.repositoryService.getById(this.type, id, options).map(response => this.mapSingle(response));
    }
}