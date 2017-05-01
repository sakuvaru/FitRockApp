import { RepositoryService } from './repository/repository.service';
import { IItem } from './repository/iitem.class';
import { ResponseSingle } from './repository/response-single.class';
import { ResponseMultiple } from './repository/response-multiple.class';
import { IOption } from './repository/ioption.class';

export abstract class BaseService<T extends IItem>  {

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

    getAll(options?: IOption[]): Promise<T[]> {
        return this.repositoryService.getAll(this.type, options).then(response => this.mapMultiple(response));
    }

    getByCodename(codename: string, options?: IOption[]): Promise<T> {
        return this.repositoryService.getByCodename(this.type, codename, options).then(response => this.mapSingle(response));
    }

    getByGuid(guid: string, options?: IOption[]): Promise<T> {
        return this.repositoryService.getByGuid(this.type, guid, options).then(response => this.mapSingle(response));
    }

    getById(id: number, options?: IOption[]): Promise<T> {
        return this.repositoryService.getById(this.type, id, options).then(response => this.mapSingle(response));
    }
}