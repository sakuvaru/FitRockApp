import { Headers, RequestOptions } from '@angular/http';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable, Subject } from 'rxjs/Rx';

import { ErrorReasonEnum } from '../enums/error-reason.enum';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';
import { IItem } from '../interfaces/iitem.interface';
import { IOption } from '../interfaces/ioption.interface';
import { IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
import { FormValidationResult } from '../models/form-validation-result.class';
import {
    ErrorResponse,
    FormErrorResponse,
    ResponseCount,
    ResponseCreate,
    ResponseDelete,
    ResponseDeleteFile,
    ResponseEdit,
    ResponseFileMultiple,
    ResponseFileSingle,
    ResponseFormEdit,
    ResponseFormInsert,
    ResponseMultiple,
    ResponsePost,
    ResponseSingle,
    ResponseUpdateItemsOrder,
    ResponseUploadMultiple,
    ResponseUploadSingle,
} from '../models/responses';
import { UpdateItemsRequest } from '../models/update-items-request.class';
import { RepositoryConfig } from '../repository.config';
import { ResponseMapService } from './response-map.service';

export class QueryService {

    private static processingRequestSource = new Subject<boolean>();
    private static requestErrorSource = new Subject<ErrorResponse>();

    private genericErrorMessage = `An error occurred in 'RepositoryService'`;

    private responseMapService: ResponseMapService;

    public requestState: Observable<boolean> = QueryService.processingRequestSource.asObservable();
    public error: Observable<ErrorResponse> = QueryService.requestErrorSource.asObservable();

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        this.responseMapService = new ResponseMapService(config);
    }

    // Service message commands
    private finishRequest(): void {
        QueryService.processingRequestSource.next(false);
    }

    private startRequest(): void {
        QueryService.processingRequestSource.next(true);
    }

    private raiseError(errorResponse: ErrorResponse): void {
        QueryService.requestErrorSource.next(errorResponse);
    }

    private addOptionsToUrl(url: string, options?: IOption[]): string {
        if (options) {
            options.forEach(filter => {
                if (url.indexOf('?') > -1) {
                    url = url + '&' + filter.GetParam() + '=' + filter.GetParamValue();
                } else {
                    url = url + '?' + filter.GetParam() + '=' + filter.GetParamValue();
                }
            });
        }
        return url;
    }

    /* ------------------------- public methods ------------------ */

    getTypeUrl(type: string, action: string, options?: IOption[]): string {
        const url = this.config.apiUrl + '/' + this.config.typeEndpoint + '/' + type + '/' + action;

        return this.addOptionsToUrl(url, options);
    }

    getGenericUrl(controller: string, action: string, options?: IOption[]): string {
        const url = this.config.apiUrl + '/' + this.config.apiEndPoint + '/' + controller + '/' + action;

        return this.addOptionsToUrl(url, options);
    }

    get<TAny>(url: string): Observable<TAny> {
        return this.getResponse(url)
            .map(response => {
                return response.json() as TAny;
            });
    }

    getMultipleCustom<TModel>(url: string): Observable<ResponseMultiple<TModel>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapMultipleResponseCustom(response);
            });
    }

    getMultiple<TItem extends IItem>(url: string): Observable<ResponseMultiple<TItem>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapMultipleResponse(response);
            });
    }

    getCount<TItem extends IItem>(url: string): Observable<ResponseCount> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapCountResponse(response);
            });
    }

    getSingle<TItem extends IItem>(url: string): Observable<ResponseSingle<TItem>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapSingleResponse(response);
            });
    }

    getSingleCustom<TModel>(url: string): Observable<ResponseSingle<TModel>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapSingleResponseCustom(response);
            });
    }

    create<TItem extends IItem>(url: string, body: any): Observable<ResponseCreate<TItem>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapCreateResponse(response);
            });
    }

    edit<TItem extends IItem>(url: string, body: any): Observable<ResponseEdit<TItem>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapEditResponse(response);
            });
    }

    updateItemsOrder<TItem extends IItem>(url: string, updateOrderRequest: UpdateItemsRequest): Observable<ResponseUpdateItemsOrder<TItem>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, updateOrderRequest, headerOptions)
            .map(response => {
                return this.responseMapService.mapUpdateItemsOrderResponse(response);
            });
    }

    post<T extends any>(url: string, body: any): Observable<ResponsePost<T>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapPostResponse(response);
            });
    }

    touchKey<T extends any>(url: string, cacheKeyType: string, itemId?: number): Observable<ResponsePost<T>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        const body = {
            'cacheKeyType': cacheKeyType,
            'itemId': itemId
        };

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapPostResponse(response);
            });
    }

    delete(url: string): Observable<ResponseDelete> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getDeleteResponse(url, headerOptions)
            .map(response => {
                return this.responseMapService.mapDeleteResponse(response);
            });
    }

    getEditForm<TItem extends IItem>(url: string, itemId: number, disableCache?: boolean, data?: any): Observable<ResponseFormEdit<TItem>> {
        const body: any = {};
        body.id = itemId;
        body.disableCache = disableCache;
        body.data = data;

        return this.getPostResponse(url, body)
            .map(response => {
                return this.responseMapService.mapFormEditResponse<TItem>(response);
            });
    }

    getInsertForm(url: string, data?: any): Observable<ResponseFormInsert> {
        const body: any = {};
        body.data = data;

        return this.getPostResponse(url, body)
            .map(response => {
                return this.responseMapService.mapFormInsertResponse(response);
            });
    }

    uploadSingleFile(url: string, file: File): Observable<ResponseUploadSingle> {
        // do not set 'Content-Type', it messes up the request headers
        const headers = new Headers({ 'Accept': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.getPostResponse(url, formData, headerOptions)
            .map(response => {
                return this.responseMapService.mapSingleUploadResponse(response);
            });
    }

    uploadMultipleFiles(url: string, files: File[]): Observable<ResponseUploadMultiple> {
        // do not set 'Content-Type', it messes up the request headers
        const headers = new Headers({ 'Accept': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        const formData: FormData = new FormData();

        if (files && Array.isArray(files)) {
            files.forEach(file => {
                formData.append('files', file, file.name);
            });
        }

        return this.getPostResponse(url, formData, headerOptions)
            .map(response => {
                return this.responseMapService.mapMultipleUploadResponse(response);
            });
    }

    getSingleFile(url: string): Observable<ResponseFileSingle> {
        return this.authHttp.get(url)
            .map(response => {
                return this.responseMapService.mapSingleFileResponse(response);
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    getMultipleFiles(url: string): Observable<ResponseFileMultiple> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapMultipleFileResponse(response);
            });
    }

    deleteFile(url: string, fileUrl: string): Observable<ResponseDeleteFile> {
        const body: any = {};
        body.fileUrl = fileUrl; // fileUrl property is required by the API Server

        return this.getPostResponse(url, body)
            .map(response => {
                return this.responseMapService.mapDeleteFileResponse(response);
            });

    }

    /*--------------------- Error handling -------------------- */

    private getError(response: Response | any): ErrorResponse {
        if (response instanceof Response) {
            // Server not running error
            if (response.status === 0) {
                // return error response
                return new ErrorResponse('Server is not running, please try again later', ErrorReasonEnum.ServerNotRunning, response);
            }

            // 404 error
            if (response.status === 404) {
                // return error response
                return new ErrorResponse(response.statusText || '', ErrorReasonEnum.NotFound, response);
            }

            // create either 'FormResponse' or generic 'ErrorResponse'
            const iFormErrorResponse = response.json() as IFormErrorResponseRaw;
            const iErrorResponse = response.json() as IErrorResponseRaw;

            // form validation error because 'formValidation' property exists
            if (iFormErrorResponse.formValidation) {
                const iformValidation = iFormErrorResponse.formValidation as IFormValidationResult;

                const formValidation = new FormValidationResult(
                    iformValidation.validationResult,
                    iformValidation.message,
                    iformValidation.isInvalid,
                    iformValidation.messageKey,
                    iformValidation.column
                );

                // return form validation error
                return new FormErrorResponse(iFormErrorResponse.reason, iFormErrorResponse.error, formValidation, response);
            }
            return new ErrorResponse(iErrorResponse.error, iErrorResponse.reason, response);
        }

        // return ErrorResponse for unknown error
        return new ErrorResponse(this.genericErrorMessage, ErrorReasonEnum.RepositoryException, response);
    }

    private handleError(response: Response | any): IErrorResponseRaw | IFormErrorResponseRaw {
        if (this.config.logErrorsToConsole) {
            console.error(response);
        }

        // get error model
        const error = this.getError(response);

        // raise error
        this.raiseError(error);

        return error;
    }

    /* -------------------- Response methods ------------------ */

    private getResponse(url: string): Observable<Response> {
        return this.authHttp.get(url)
            .do(() => this.startRequest())
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    private getPostResponse(url: string, data: any, requestOptions?: RequestOptions): Observable<Response> {
        return this.authHttp.post(url, data, requestOptions)
            .do(() => this.startRequest())
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    private getDeleteResponse(url: string, requestOptions?: RequestOptions): Observable<Response> {
        return this.authHttp.delete(url, requestOptions)
            .do(() => this.startRequest())
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }
}
