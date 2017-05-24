import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { ErrorResponse } from './error-response.class';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from './responses';
import { IOption } from './ioption.class';
import { AuthHttp } from 'angular2-jwt';
import { AppConfig } from '../core/config/app.config';
import { AppDataService } from '../core/app-data.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { IItem } from './iitem.class';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RepositoryService {

    private apiUrl = AppConfig.RepositoryApiEndpoint;

    private genericErrorMessage = 'An error occurred in "RepositoryService"';

    // Observable string sources
    private processingRequestSource = new Subject<boolean>();
    private requestErrorSource = new Subject<ErrorResponse>();

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

    raiseError(errorResponse: ErrorResponse) {
        this.requestErrorSource.next(errorResponse);
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

        var errorResponse: ErrorResponse;
        var errMsg: string;

        if (error instanceof Response) {
            errMsg = `${this.genericErrorMessage}: ${error.status} - ${error.statusText || ''} ${error}`;

            errorResponse = new ErrorResponse(errMsg, error.status);

        } else {
            errMsg = error.message ? error.message : error.toString();

            errorResponse = new ErrorResponse(error.message, error.status);
        }

        // raise error
        this.raiseError(errorResponse);

        return Observable.throw(errMsg);
    }

    private extractData<TItem extends IItem>(response: Response): ResponseMultiple<TItem> {
        let body = response.json();
        return body || {};
    }

    getMultiple<TItem extends IItem>(type: string, action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + '/' + action;

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

    getSingle<TItem extends IItem>(type: string, action: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + '/' + action;

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

    create<TItem extends IItem>(type: string, action: string, body: any): Observable<ResponseCreate<TItem>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var url = this.getBaseUrl(type) + '/' + action;

        return this.authHttp.post(url, body, options)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    edit<TItem extends IItem>(type: string, action: string, body: any): Observable<ResponseEdit<TItem>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var url = this.getBaseUrl(type) + '/' + action;

        return this.authHttp.post(url, body, options)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    delete(type: string, action: string): Observable<ResponseDelete> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var url = this.getBaseUrl(type) + '/' + action;

        return this.authHttp.delete(url, options)
            .map(this.extractData)
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }
}