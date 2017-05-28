import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { ErrorResponse } from './error-response.class';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from './responses';
import { IResponseCreateRaw, IResponseDeleteRaw, IResponseEditRaw, IResponseMultipleRaw, IResponseSingleRaw } from './iraw-responses';
import { IOption } from './ioption.interface';
import { AuthHttp } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { IItem } from './iitem.interface';
import { RepositoryConfig } from './repository.config';
import { MapService } from './map.service';
import { TypeResolverService } from './type-resolver.service';
import { IErrorResponse } from './ierror-response';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export abstract class BaseRepositoryService {

    private genericErrorMessage = 'An error occurred in "RepositoryService"';

    // services
    private mapService: MapService;

    // Observable string sources
    private processingRequestSource = new Subject<boolean>();
    private requestErrorSource = new Subject<ErrorResponse>();

    // Observable string streams
    requestStateChanged$ = this.processingRequestSource.asObservable();
    requestErrorChange$ = this.requestErrorSource.asObservable();

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        this.mapService = new MapService(new TypeResolverService(config.typeResolvers));
    }

    // Service message commands
    private finishRequest(): void {
        this.processingRequestSource.next(false);
    }

    private startRequest(): void {
        this.processingRequestSource.next(true);
    }

    private raiseError(errorResponse: ErrorResponse) {
        this.requestErrorSource.next(errorResponse);
    }

    private getActionUrl(type: string, action: string, options?: IOption[]): string {
        var url = this.config.apiUrl + '/' + type + '/' + action;

        return this.addOptionsToUrl(url, options);
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

    private handleError(response: Response | any): Observable<ErrorResponse> {
        // use a remote logging later on
        var errorResponse: ErrorResponse;

        if (response instanceof Response) {
             var iErrorResponse = response.json() as IErrorResponse;
            errorResponse = new ErrorResponse(iErrorResponse.error, iErrorResponse.result);

        } else {
            errorResponse = new ErrorResponse(this.genericErrorMessage, response.status);
        }

        // raise error
        this.raiseError(errorResponse);

        console.error(errorResponse);

        return Observable.throw(errorResponse);
    }

    private getMultipleResponse<TItem extends IItem>(response: Response): ResponseMultiple<TItem> {
        var responseMultiple = (response.json() || {}) as IResponseMultipleRaw;

        var items = this.mapService.mapItems<TItem>(responseMultiple.items);

        return new ResponseMultiple<TItem>({
            fromCache: responseMultiple.fromCache,
            action: responseMultiple.action,
            limit: responseMultiple.limit,
            itemsPerPage: responseMultiple.itemsPerPage,
            page: responseMultiple.page,
            result: responseMultiple.result,
            pages: responseMultiple.pages,
            timeCreated: responseMultiple.timeCreated,
            totalItems: responseMultiple.totalItems,
            type: responseMultiple.type,
            items: items
        });
    }

    private getSingleResponse<TItem extends IItem>(response: Response): ResponseSingle<TItem> {
        var responseSingle = (response.json() || {}) as IResponseSingleRaw;

        var item = this.mapService.mapItem<TItem>(responseSingle.item);

        return new ResponseSingle<TItem>({
            fromCache: responseSingle.fromCache,
            action: responseSingle.action,
            result: responseSingle.result,
            timeCreated: responseSingle.timeCreated,
            type: responseSingle.type,
            item: item
        });
    }

    private getCreateResponse<TItem extends IItem>(response: Response): ResponseCreate<TItem> {
        var responseCreate = (response.json() || {}) as IResponseCreateRaw;

        var item = this.mapService.mapItem<TItem>(responseCreate.item);

        return new ResponseCreate<TItem>({
            item: item,
            result: responseCreate.result
        });
    }

    private getEditResponse<TItem extends IItem>(response: Response): ResponseEdit<TItem> {
        var responseEdit = (response.json() || {}) as IResponseEditRaw;

        var item = this.mapService.mapItem<TItem>(responseEdit.item);

        return new ResponseEdit<TItem>({
            item: item,
            result: responseEdit.result
        });
    }

    private getDeleteResponse(response: Response): ResponseDelete {
        var responseDelete = (response.json() || {}) as IResponseDeleteRaw;

        return new ResponseDelete({
            result: responseDelete.result
        });
    }

    protected getMultiple<TItem extends IItem>(type: string, action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        // trigger request
        this.startRequest();

        var url = this.getActionUrl(type, action, options);

        return this.authHttp.get(url)
            .map(response => {
                return this.getMultipleResponse(response)
            })
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getSingle<TItem extends IItem>(type: string, action: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        // trigger request
        this.startRequest();

        var url = this.getActionUrl(type, action, options);

        return this.authHttp.get(url)
            .map(response => {
                return this.getSingleResponse(response)
            })
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected create<TItem extends IItem>(type: string, action: string, body: any): Observable<ResponseCreate<TItem>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var url = this.getActionUrl(type, action);

        return this.authHttp.post(url, body, options)
            .map(response => {
                return this.getCreateResponse(response)
            })
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected edit<TItem extends IItem>(type: string, action: string, body: any): Observable<ResponseEdit<TItem>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var url = this.getActionUrl(type, action);

        return this.authHttp.post(url, body, options)
            .map(response => {
                return this.getEditResponse(response)
            })
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected delete(type: string, action: string): Observable<ResponseDelete> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var url = this.getActionUrl(type, action);

        return this.authHttp.delete(url, options)
            .map(response => {
                return this.getDeleteResponse(response)
            })
            .catch(response => {
                return this.handleError(response);
            })
            ._finally(() => {
                this.finishRequest();
            });
    }
}