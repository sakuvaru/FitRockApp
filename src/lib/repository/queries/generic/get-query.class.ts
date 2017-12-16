import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { IOption } from '../../interfaces/ioption.interface';
import * as Options from '../../models/options';
import { BaseQuery } from '../base-query.class';

export class GetQuery<T extends any> extends BaseQuery {

    protected options: IOption[] = [];

    constructor(
        protected queryService: QueryService,
        protected controller: string,
        protected action: string,
    ) {
        super(queryService);
    }

    withCustomOption(optionName: string, value: string | boolean | number | Date): this {
        this.options.push(new Options.CustomOption(optionName, value));
        return this;
    }

    // url
    protected getGetUrl(): string {
        return this.queryService.getGenericUrl(this.controller, this.action, this.options);
    }

    // execution

    set(): Observable<T> {
        return this.queryService.get(this.getGetUrl());
    }

    // debug

    toString(): string {
        return this.getGetUrl();
    }
}
