import { QueryService } from './services/query.service';
import { IItem } from './interfaces/iitem.interface';
import { AuthHttp } from 'angular2-jwt';
import { RepositoryConfig } from './repository.config';
import { SingleItemQueryInit } from './queries/get/single-item-query.class';
import { MultipleItemQuery } from './queries/get/multiple-item-query.class';
import { CreateItemQuery } from './queries/manage/create-item-query.class';
import { EditItemQuery } from './queries/manage/edit-item-query.class';
import { DeleteItemQuery } from './queries/manage/delete-item-query.class';
import { ErrorResponse } from './models/responses';

// rxjs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class RepositoryClient {

    private queryService: QueryService;

    // Observables
    public requestStateChanged$: Observable<boolean>;
    public requestErrorChange$: Observable<ErrorResponse>;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        this.queryService = new QueryService(this.authHttp, this.config);
        this.requestErrorChange$ = this.queryService.requestErrorChange$;
        this.requestStateChanged$ = this.queryService.requestStateChanged$;
    }

    items<TItem extends IItem>(type: string): MultipleItemQuery<TItem> {
        return new MultipleItemQuery<TItem>(this.authHttp, this.config, type);
    }

    item<TItem extends IItem>(type: string): SingleItemQueryInit<TItem> {
        return new SingleItemQueryInit<TItem>(this.authHttp, this.config, type);
    }

    create<TItem extends IItem>(type: string, item: TItem): CreateItemQuery<TItem> {
        return new CreateItemQuery(this.authHttp, this.config, type, item);
    }

    edit<TItem extends IItem>(type: string, item: TItem): EditItemQuery<TItem> {
        return new EditItemQuery(this.authHttp, this.config, type, item);
    }

    delete<TItem extends IItem>(type: string, itemId: number): DeleteItemQuery {
        return new DeleteItemQuery(this.authHttp, this.config, type, itemId);
    }
}


