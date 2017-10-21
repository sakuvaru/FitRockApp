// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// models
import { IOption } from '../../interfaces/ioption.interface';
import * as Options from '../../models/options';

// responses
import { ResponsePost } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class GetQuery<T extends any> extends BaseQuery {

    protected options: IOption[] = [];

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected controller: string,
        protected action: string,
    ) {
        super(authHttp, config);
    }

    withCustomOption(optionName: string, value: string | boolean | number | Date): this {
        this.options.push(new Options.CustomOption(optionName, value));
        return this;
    }

    // url
    protected getGetUrl(): string {
        return this.getGenericUrl(this.controller, this.action, this.options);
    }

    // execution

    set(): Observable<T> {
        return super.get(this.getGetUrl());
    }

    // debug

    toString(): string {
        return this.getGetUrl();
    }
}
