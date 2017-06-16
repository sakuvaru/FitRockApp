import { QueryService } from './queries/query.service';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from './models/responses';
import { IItem } from './interfaces/iitem.interface';
import { AuthHttp } from 'angular2-jwt';
import { RepositoryConfig } from './repository.config';
import { SingleItemQueryInit } from './queries/item/single-item-query.class';
import { MultipleItemQuery } from './queries/item/multiple-item-query.class';

// rxjs
import { Observable } from 'rxjs/Observable';

export class RepositoryService extends QueryService {

    constructor(
       protected authHttp: AuthHttp,
       protected config: RepositoryConfig
    ) { super(authHttp, config) }

    items<TItem extends IItem>(type: string): MultipleItemQuery<TItem> {
        return new MultipleItemQuery<TItem>(this.authHttp, this.config, type);
    }

    item<TItem extends IItem>(type: string): SingleItemQueryInit<TItem> {
        return new SingleItemQueryInit<TItem>(this.authHttp, this.config, type);
    }

    create<TItem extends IItem>(type: string, action: string, obj: TItem): Observable<ResponseCreate<TItem>> {
        return super.create<TItem>(type, action, obj);
    }

    edit<TItem extends IItem>(type: string, action: string, obj: TItem): Observable<ResponseEdit<TItem>> {
        return super.edit<TItem>(type, action, obj);
    }

    delete<TItem extends IItem>(type: string, action: string): Observable<ResponseDelete> {
        return super.delete(type, action);
    }
}


