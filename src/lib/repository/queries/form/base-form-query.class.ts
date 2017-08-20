// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { IItem } from '../../interfaces/iitem.interface';
import { BaseQuery } from '../common/base-query.class';
import { IOption } from '../../interfaces/ioption.interface';

// filters
import * as Options from '../../models/options';

// responses
import {
    ResponseFormEdit, ResponseFormInsert
} from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseFormQuery extends BaseQuery {

    abstract get(): Observable<any>;

    protected _options: IOption[] = [];
    protected _action: string;

    /**
    * Extra data send to server
    */
    protected _data: any = {};

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config)
    }

    public withData(name: string, value: string | boolean | number): this{
        this._data[name] = value;
        return this;
    }

    protected getFormQueryUrl(): string {
        return this.getUrl(this.type, this._action, this._options);
    }

    protected runEditFormQuery<TItem extends IItem>(): Observable<ResponseFormEdit<TItem>> {
        var url = this.getFormQueryUrl();

        return super.getEditForm<TItem>(url, this._data);
    }

    protected runInsertFormQuery(): Observable<ResponseFormInsert> {
        var url = this.getFormQueryUrl();

        return super.getInsertForm(url, this._data);
    }
}