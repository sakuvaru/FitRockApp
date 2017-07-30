import { Headers, RequestOptions } from '@angular/http';
import { ResponsePost, ResponseFormEdit, ResponseFormInsert, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle, ErrorResponse, FormErrorResponse } from '../models/responses';
import { IResponsePostRaw, IResponseFormEditRaw, IResponseFormInsertRaw, IResponseCreateRaw, IResponseDeleteRaw, IResponseEditRaw, IResponseMultipleRaw, IResponseSingleRaw, IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
import { IOption } from '../interfaces/ioption.interface';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { IItem } from '../interfaces/iitem.interface';
import { RepositoryConfig } from '../repository.config';
import { MapService } from './map.service';
import { TypeResolverService } from './type-resolver.service';
import { ColumnValidation } from '../models/column-validation.class';
import { IColumnValidation } from '../interfaces/icolumn-validation.interface';
import { FormValidationResult } from '../models/form-validation-result.class';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';
import { ErrorReasonEnum } from '../models/error-reason.enum';

// rxjs
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class QueryService {

    private genericErrorMessage = `An error occurred in 'RepositoryService'`;

    // services
    private mapService: MapService;

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
        this.mapService = new MapService(new TypeResolverService(config.typeResolvers));
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
                }
                else {
                    url = url + '?' + filter.GetParam() + '=' + filter.GetParamValue();
                }
            });
        }
        return url;
    }

    protected getUrl(type: string, action: string, options?: IOption[]): string {
        var url = this.config.apiUrl + '/' + type + '/' + action;

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
            // 404 error
            if (response.status === 404) {
                // return error response
                return new ErrorResponse(response.statusText, ErrorReasonEnum.NotFound, response);
            }

            // create either 'FormResponse' or generic 'ErrorResponse'
            var iFormErrorResponse = response.json() as IFormErrorResponseRaw;
            var iErrorResponse = response.json() as IErrorResponseRaw;

            // form validation error because 'formValidation' property exists
            if (iFormErrorResponse.formValidation) {
                var iformValidation = iFormErrorResponse.formValidation as IFormValidationResult;
                var icolumnValidations = iformValidation.validationResult as IColumnValidation[];

                var columnValidations: ColumnValidation[] = [];
                icolumnValidations.forEach(validation => {
                    columnValidations.push(new ColumnValidation(validation.columnName, validation.result));
                });

                var formValidation = new FormValidationResult(iformValidation.message, iformValidation.isInvalid, columnValidations);

                // return form validation error
                return new FormErrorResponse(iFormErrorResponse.error, iFormErrorResponse.reason, formValidation, response);
            }
            return new ErrorResponse(iErrorResponse.error, iErrorResponse.reason, response);
        }

        // return ErrorResponse for unknown error
        return new ErrorResponse(this.genericErrorMessage, ErrorReasonEnum.RepositoryException, response);
    }

    // response methods
    private getMultipleResponseCustom<TModel>(response: Response): ResponseMultiple<TModel> {
        var responseMultiple = (response.json() || {}) as IResponseMultipleRaw;

        return new ResponseMultiple<TModel>({
            fromCache: responseMultiple.fromCache,
            action: responseMultiple.action,
            limit: responseMultiple.limit,
            itemsPerPage: responseMultiple.itemsPerPage,
            page: responseMultiple.page,
            pages: responseMultiple.pages,
            timeCreated: responseMultiple.timeCreated,
            totalItems: responseMultiple.totalItems,
            type: responseMultiple.type,
            items: responseMultiple.items
        });
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
            pages: responseMultiple.pages,
            timeCreated: responseMultiple.timeCreated,
            totalItems: responseMultiple.totalItems,
            type: responseMultiple.type,
            items: items
        });
    }

    private getSingleResponseCustom<TModel>(response: Response): ResponseSingle<TModel> {
        var responseSingle = (response.json() || {}) as IResponseSingleRaw;

        return new ResponseSingle<TModel>({
            fromCache: responseSingle.fromCache,
            action: responseSingle.action,
            timeCreated: responseSingle.timeCreated,
            type: responseSingle.type,
            item: responseSingle.item
        });
    }

    private getSingleResponse<TItem extends IItem>(response: Response): ResponseSingle<TItem> {
        var responseSingle = (response.json() || {}) as IResponseSingleRaw;

        var item = this.mapService.mapItem<TItem>(responseSingle.item);

        return new ResponseSingle<TItem>({
            fromCache: responseSingle.fromCache,
            action: responseSingle.action,
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
        });
    }

    private getEditResponse<TItem extends IItem>(response: Response): ResponseEdit<TItem> {
        var responseEdit = (response.json() || {}) as IResponseEditRaw;

        var item = this.mapService.mapItem<TItem>(responseEdit.item);

        return new ResponseEdit<TItem>({
            item: item,
        });
    }

    private getPostResponse<T extends any>(response: Response): ResponsePost<T> {
        var responsePost = (response.json() || {}) as IResponsePostRaw;

        return new ResponsePost<T>({
            data: responsePost.data as T,
            action: responsePost.action,
            message: responsePost.message
        });
    }

    private getDeleteResponse(response: Response): ResponseDelete {
        var responseDelete = (response.json() || {}) as IResponseDeleteRaw;

        return new ResponseDelete({
            action: responseDelete.action,
            deletedItemId: responseDelete.deletedItemId
        });
    }

    private getFormEditResponse<TItem extends IItem>(response: Response): ResponseFormEdit<TItem> {
        var responseForm = (response.json() || {}) as IResponseFormEditRaw;

        var formFields = this.mapService.mapFormFields(responseForm.fields);
        var item = this.mapService.mapItem<TItem>(responseForm.item);

        return new ResponseFormEdit<TItem>({
            fields: formFields,
            formType: responseForm.formType,
            type: responseForm.type,
            fromCache: responseForm.fromCache,
            timeCreated: responseForm.timeCreated,
            item: item
        });
    }

    private getFormInsertResponse(response: Response): ResponseFormInsert {
        var responseForm = (response.json() || {}) as IResponseFormInsertRaw;

        var formFields = this.mapService.mapFormFields(responseForm.fields);

        return new ResponseFormInsert({
            fields: formFields,
            formType: responseForm.formType,
            type: responseForm.type
        });
    }

    protected getMultipleCustom<TModel>(url: string): Observable<ResponseMultiple<TModel>> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getMultipleResponseCustom(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getMultiple<TItem extends IItem>(url: string): Observable<ResponseMultiple<TItem>> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getMultipleResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getSingle<TItem extends IItem>(url: string): Observable<ResponseSingle<TItem>> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getSingleResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getSingleCustom<TModel>(url: string): Observable<ResponseSingle<TModel>> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getSingleResponseCustom(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected create<TItem extends IItem>(url: string, body: any): Observable<ResponseCreate<TItem>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var headerOptions = new RequestOptions({ headers: headers });

        return this.authHttp.post(url, body, headerOptions)
            .map(response => {
                return this.getCreateResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected edit<TItem extends IItem>(url: string, body: any): Observable<ResponseEdit<TItem>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var headerOptions = new RequestOptions({ headers: headers });

        return this.authHttp.post(url, body, headerOptions)
            .map(response => {
                return this.getEditResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            })
    }

    protected post<T extends any>(url: string, body: any): Observable<ResponsePost<T>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var headerOptions = new RequestOptions({ headers: headers });

        return this.authHttp.post(url, body, headerOptions)
            .map(response => {
                return this.getPostResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected touchKey<T extends any>(url: string, cacheKeyType: string, itemId?: number): Observable<ResponsePost<T>> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var headerOptions = new RequestOptions({ headers: headers });

        var body = {
            'cacheKeyType': cacheKeyType,
            'itemId': itemId
        };

        return this.authHttp.post(url, body, headerOptions)
            .map(response => {
                return this.getPostResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected delete(url: string): Observable<ResponseDelete> {
        // trigger request
        this.startRequest();

        var headers = new Headers({ 'Content-Type': 'application/json' });
        var headerOptions = new RequestOptions({ headers: headers });

        return this.authHttp.delete(url, headerOptions)
            .map(response => {
                return this.getDeleteResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getEditForm<TItem extends IItem>(url: string): Observable<ResponseFormEdit<TItem>> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getFormEditResponse<TItem>(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getInsertForm(url: string): Observable<ResponseFormInsert> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getFormInsertResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    /**
     * Merges given observables into one
     * @param observables Observables to merge
     */
    mergeObservables(observables: Observable<any>[]): Observable<any> {
        if (!observables) {
            throw Error(`Given Observables are not valid`);
        }

        if (!Array.isArray(observables)) {
            throw Error(`Given observables are not in array`);
        }

        var mergedObservable: Observable<any>;

        observables.forEach(observable => {
            if (!mergedObservable) {
                mergedObservable = observable;
            }
            else {
                mergedObservable = mergedObservable.merge(observable);
            }
        })

        return mergedObservable;
    }
}