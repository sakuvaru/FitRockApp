import { Injectable } from '@angular/core';
import { Log } from '../models/log.class';
import { RepositoryClient, ResponseCreate, ResponseMultiple } from '../../lib/repository';
import { BaseTypeService } from './base/base-type.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LogService extends BaseTypeService<Log>{

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Log',
            allowDelete: true
        });
    }

    logError(errorMessage: string, url: string, user: string, stacktrace: string): Observable<ResponseCreate<Log>>{
        const log = new Log();
        log.errorMessage = errorMessage;
        log.url = url;
        log.user = user;
        log.stacktrace = stacktrace;

        return super.create(log).set();
    }

    getLogByGuid(guid: string): Observable<ResponseMultiple<Log>>{
        return super.items().withCustomAction('GetLogByGuid/' + guid).get();
    }
}
