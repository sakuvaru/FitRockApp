// core models
import { Headers, RequestOptions } from '@angular/http';
import { IOption } from '../interfaces/ioption.interface';
import { Response } from '@angular/http';
import { IItem } from '../interfaces/iitem.interface';
import { RepositoryConfig } from '../repository.config';
import { UpdateItemsRequest } from '../models/update-items-request.class';

// raw responses
import {
    IResponseDeleteFile, IResponseFileMultiple, IResponseFileSingle, IResponseUploadMultipleRaw,
    IResponseUploadSingleRaw, IResponseCountRaw, IResponsePostRaw, IResponseFormEditRaw,
    IResponseFormInsertRaw, IResponseCreateRaw, IResponseDeleteRaw, IResponseEditRaw, IResponseMultipleRaw,
    IResponseSingleRaw, IErrorResponseRaw, IFormErrorResponseRaw, IResponseUpdateItemsOrder
} from '../interfaces/iraw-responses';

// responses
import {
    ResponseDeleteFile, ResponseFileMultiple, ResponseFileSingle, ResponseUploadMultiple,
    ResponseUploadSingle, ResponseCount, ResponsePost, ResponseFormEdit, ResponseFormInsert,
    ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle,
    ErrorResponse, FormErrorResponse, ResponseUpdateItemsOrder
} from '../models/responses';

// form validation models
import { ColumnValidation } from '../models/column-validation.class';
import { IColumnValidation } from '../interfaces/icolumn-validation.interface';
import { FormValidationResult } from '../models/form-validation-result.class';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';

// services
import { AuthHttp } from 'angular2-jwt';
import { TypeResolverService } from './type-resolver.service';
import { ResponseMapService } from './response-map.service';

// enums
import { ErrorReasonEnum } from '../models/error-reason.enum';

// rxjs
import { Observable, Subject } from 'rxjs/Rx';

export class QueryService {

    private genericErrorMessage = `An error occurred in 'RepositoryService'`;

    // services
    private responseMapService: ResponseMapService;

    // Observable string sources
    public processingRequestSource = new Subject<boolean>();
    public requestErrorSource = new Subject<ErrorResponse>();

    // Observable string streams
    public requestStateChanged$ = this.processingRequestSource.asObservable();
    public requestErrorChange$ = this.requestErrorSource.asObservable();

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        this.responseMapService = new ResponseMapService(config);
    }

    // Service message commands
    private finishRequest(): void {
        this.processingRequestSource.next(false);
    }

    private startRequest(): void {
        this.processingRequestSource.next(true);
    }

    private raiseError(errorResponse: ErrorResponse): void {
        this.requestErrorSource.next(errorResponse);
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

    protected getTypeUrl(type: string, action: string, options?: IOption[]): string {
        const url = this.config.apiUrl + '/' + this.config.typeEndpoint + '/' + type + '/' + action;

        return this.addOptionsToUrl(url, options);
    }

    protected getGenericUrl(controller: string, action: string, options?: IOption[]): string {
        const url = this.config.apiUrl + '/' + this.config.apiEndPoint + '/' + controller + '/' + action;

        return this.addOptionsToUrl(url, options);
    }

    // error handling
    private handleError(response: Response | any): IErrorResponseRaw | IFormErrorResponseRaw {
        // raise error
        this.raiseError(response);

        if (this.config.logErrorsToConsole) {
            console.error(response);
        }

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
                const icolumnValidations = iformValidation.validationResult as IColumnValidation[];

                const columnValidations: ColumnValidation[] = [];
                icolumnValidations.forEach(validation => {
                    columnValidations.push(new ColumnValidation(validation.columnName, validation.result));
                });

                const formValidation = new FormValidationResult(iformValidation.message, iformValidation.isInvalid, columnValidations);

                // return form validation error
                return new FormErrorResponse(iFormErrorResponse.error, iFormErrorResponse.reason, formValidation, response);
            }
            return new ErrorResponse(iErrorResponse.error, iErrorResponse.reason, response);
        }

        // return ErrorResponse for unknown error
        return new ErrorResponse(this.genericErrorMessage, ErrorReasonEnum.RepositoryException, response);
    }

    protected get<TAny>(url: string): Observable<TAny> {
        return this.getResponse(url)
            .map(response => {
                return response.json() as TAny;
            });
    }

    protected getMultipleCustom<TModel>(url: string): Observable<ResponseMultiple<TModel>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapMultipleResponseCustom(response);
            });
    }

    protected getMultiple<TItem extends IItem>(url: string): Observable<ResponseMultiple<TItem>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapMultipleResponse(response);
            });
    }

    protected getCount<TItem extends IItem>(url: string): Observable<ResponseCount> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapCountResponse(response);
            });
    }

    protected getSingle<TItem extends IItem>(url: string): Observable<ResponseSingle<TItem>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapSingleResponse(response);
            });
    }

    protected getSingleCustom<TModel>(url: string): Observable<ResponseSingle<TModel>> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapSingleResponseCustom(response);
            });
    }

    protected create<TItem extends IItem>(url: string, body: any): Observable<ResponseCreate<TItem>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapCreateResponse(response);
            });
    }

    protected edit<TItem extends IItem>(url: string, body: any): Observable<ResponseEdit<TItem>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapEditResponse(response);
            });
    }

    protected updateItemsOrder<TItem extends IItem>(url: string, updateOrderRequest: UpdateItemsRequest): Observable<ResponseUpdateItemsOrder<TItem>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, updateOrderRequest, headerOptions)
            .map(response => {
                return this.responseMapService.mapUpdateItemsOrderResponse(response);
            });
    }

    protected post<T extends any>(url: string, body: any): Observable<ResponsePost<T>> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getPostResponse(url, body, headerOptions)
            .map(response => {
                return this.responseMapService.mapPostResponse(response);
            });
    }

    protected touchKey<T extends any>(url: string, cacheKeyType: string, itemId?: number): Observable<ResponsePost<T>> {
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

    protected delete(url: string): Observable<ResponseDelete> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const headerOptions = new RequestOptions({ headers: headers });

        return this.getDeleteResponse(url, headerOptions)
            .map(response => {
                return this.responseMapService.mapDeleteResponse(response);
            });
    }

    protected getEditForm<TItem extends IItem>(url: string, itemId: number, disableCache?: boolean, data?: any): Observable<ResponseFormEdit<TItem>> {
        const body: any = {};
        body.id = itemId;
        body.disableCache = disableCache;
        body.data = data;

        return this.getPostResponse(url, body)
            .map(response => {
                return this.responseMapService.mapFormEditResponse<TItem>(response);
            });
    }

    protected getInsertForm(url: string, data?: any): Observable<ResponseFormInsert> {
        const body: any = {};
        body.data = data;

        return this.getPostResponse(url, body)
            .map(response => {
                return this.responseMapService.mapFormInsertResponse(response);
            });
    }

    protected uploadSingleFile(url: string, file: File): Observable<ResponseUploadSingle> {
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

    protected uploadMultipleFiles(url: string, files: File[]): Observable<ResponseUploadMultiple> {
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

    protected getSingleFile(url: string): Observable<ResponseFileSingle> {
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

    protected getMultipleFiles(url: string): Observable<ResponseFileMultiple> {
        return this.getResponse(url)
            .map(response => {
                return this.responseMapService.mapMultipleFileResponse(response);
            });
    }

    protected deleteFile(url: string, fileUrl: string): Observable<ResponseDeleteFile> {
        const body: any = {};
        body.fileUrl = fileUrl; // fileUrl property is required by the API Server

        return this.getPostResponse(url, body)
            .map(response => {
                return this.responseMapService.mapDeleteFileResponse(response);
            });

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
