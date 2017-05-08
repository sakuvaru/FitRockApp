import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { ResponseSingle } from './response-single.class';
import { ResponseMultiple } from './response-multiple.class';
import { IOption } from './ioption.class';
import { AuthHttp } from 'angular2-jwt';
import { AppConfig } from '../core/config/app.config';
import { AppDataService } from '../core/app-data.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RepositoryService {

    private apiUrl = AppConfig.RepositoryApiEndpoint;

    private genericErrorMessage = 'An error occurred in "RepositoryService"';

    // Observable string sources
    private processingRequestSource = new Subject<boolean>();
    private requestErrorSource = new Subject<string>();

    // Observable string streams
    requestStateChanged$ = this.processingRequestSource.asObservable();
    requestErrorChange$ = this.requestErrorSource.asObservable();

    // Service message commands
    finishRequest(): void {
        this.processingRequestSource.next(false);
    }

    startRequest(): void {
        this.processingRequestSource.next(true);
    }

    raiseError(errorMessage: string) {
        this.requestErrorSource.next(errorMessage);
    }

    constructor(private authHttp: AuthHttp, private appDataService: AppDataService) {
    }

    private getBaseUrl(type: string): string {
        return this.apiUrl + '/' + type;
    }

    private addOptionsToUrl(url: string, options?: IOption[]): string {
        if (options) {
            options.forEach(filter => {
                if (url.indexOf('?') > -1) {
                    url = url + '&' + filter.GetParam() + '=' + filter.GetParamValue();
                }
                else {
                    url = url + '?' + filter.GetParam() + '=' + filter.GetParamValue();
                }
            });
        }
        return url;
    }

    private handleError(error: Response | any): Observable<any> {
        // use a remote logging later on
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${this.genericErrorMessage}: ${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        // raise error
        this.raiseError(errMsg);

        return Observable.throw(errMsg);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body || {};
    }

    getAll(type: string, options?: IOption[]): Observable<ResponseMultiple> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + '/getall';

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    getByCodename(type: string, codename: string, options?: IOption[]): Observable<ResponseSingle> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + '/getbycodename/' + codename;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    getByGuid(type: string, guid: string, options?: IOption[]): Observable<ResponseSingle> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + '/getbyguid/' + guid;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    getById(type: string, id: number, options?: IOption[]): Observable<ResponseSingle> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + '/getbyid/' + id;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    /* create(type: string, message: string, stacktrace: string): Promise<any> {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });

    var url = this.getBaseUrl(type) + 'create';

    return this.authHttp.post(url, { name, message }, options)
                    .map(this.extractData)
                    .catch(this.handleError)
                    .toPromise();
     }

     private extractData(res: Response) {
  let body = res.json();
  return body || { };
}*/

}