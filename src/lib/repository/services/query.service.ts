import { Headers, RequestOptions } from '@angular/http';
import { ResponseDeleteFile, ResponseFileMultiple, ResponseFileSingle, ResponseUploadMultiple, 
    ResponseUploadSingle, ResponseCount, ResponsePost, ResponseFormEdit, ResponseFormInsert, 
    ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle,
    ErrorResponse, FormErrorResponse } from '../models/responses';
import { IResponseDeleteFile, IResponseFileMultiple, IResponseFileSingle, IResponseUploadMultipleRaw, 
    IResponseUploadSingleRaw, IResponseCountRaw, IResponsePostRaw, IResponseFormEditRaw, 
    IResponseFormInsertRaw, IResponseCreateRaw, IResponseDeleteRaw, IResponseEditRaw, IResponseMultipleRaw,
    IResponseSingleRaw, IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
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
import { FetchedFile } from '../models/fetched-file.class';
import { IFetchedFile } from '../interfaces/ifetched-file.interface';

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

    protected getTypeUrl(type: string, action: string, options?: IOption[]): string {
        var url = this.config.apiUrl + '/' + this.config.typeEndpoint + '/' + type + '/' + action;

        return this.addOptionsToUrl(url, options);
    }

    protected getGenericUrl(controller: string, action: string, options?: IOption[]): string {
        var url = this.config.apiUrl + '/' + controller + '/' + action;

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
                return new ErrorResponse(response.statusText || '', ErrorReasonEnum.NotFound, response);
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
            items: responseMultiple.items,
            model: responseMultiple.model
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
            items: items,
            model: responseMultiple.model
        });
    }

    private getSingleResponseCustom<TModel>(response: Response): ResponseSingle<TModel> {
        var responseSingle = (response.json() || {}) as IResponseSingleRaw;

        return new ResponseSingle<TModel>({
            fromCache: responseSingle.fromCache,
            action: responseSingle.action,
            timeCreated: responseSingle.timeCreated,
            type: responseSingle.type,
            item: responseSingle.item,
            model: responseSingle.model
        });
    }

    private getCountResponse<TItem extends IItem>(response: Response): ResponseCount {
        var responseCount = (response.json() || {}) as IResponseCountRaw;

        return new ResponseCount({
            fromCache: responseCount.fromCache,
            action: responseCount.action,
            timeCreated: responseCount.timeCreated,
            type: responseCount.type,
            count: responseCount.count,
            model: responseCount.model
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
            item: item,
            model: responseSingle.model
        });
    }

    private getCreateResponse<TItem extends IItem>(response: Response): ResponseCreate<TItem> {
        var responseCreate = (response.json() || {}) as IResponseCreateRaw;

        var item = this.mapService.mapItem<TItem>(responseCreate.item);

        return new ResponseCreate<TItem>({
            item: item,
            model: responseCreate.model
        });
    }

    private getEditResponse<TItem extends IItem>(response: Response): ResponseEdit<TItem> {
        var responseEdit = (response.json() || {}) as IResponseEditRaw;

        var item = this.mapService.mapItem<TItem>(responseEdit.item);

        return new ResponseEdit<TItem>({
            item: item,
            model: responseEdit.model
        });
    }

    private getPostResponse<T extends any>(response: Response): ResponsePost<T> {
        var responsePost = (response.json() || {}) as IResponsePostRaw;

        return new ResponsePost<T>({
            data: responsePost.data as T,
            action: responsePost.action,
            message: responsePost.message,
            model: responsePost.model
        });
    }

    private getDeleteResponse(response: Response): ResponseDelete {
        var responseDelete = (response.json() || {}) as IResponseDeleteRaw;

        return new ResponseDelete({
            action: responseDelete.action,
            deletedItemId: responseDelete.deletedItemId,
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
            item: item,
            model: responseForm.model
        });
    }

    private getFormInsertResponse(response: Response): ResponseFormInsert {
        var responseForm = (response.json() || {}) as IResponseFormInsertRaw;

        var formFields = this.mapService.mapFormFields(responseForm.fields);

        return new ResponseFormInsert({
            fields: formFields,
            formType: responseForm.formType,
            type: responseForm.type,
            model: responseForm.model
        });
    }

    private getSingleUploadResponse(response: Response): ResponseUploadSingle {
        var responseUpload = (response.json() || {}) as IResponseUploadSingleRaw;

        var file = this.mapService.mapFile(responseUpload.file);

        return new ResponseUploadSingle({
            file: file,
            action: responseUpload.action,
        });
    }

    private getMultipleUploadResponse(response: Response): ResponseUploadMultiple {
        var responseUpload = (response.json() || {}) as IResponseUploadMultipleRaw;

        var files = this.mapService.mapFiles(responseUpload.files);

        return new ResponseUploadMultiple({
            files: files,
            action: responseUpload.action,
        });
    }

    private getSingleFileResponse(response: Response): ResponseFileSingle {
        var fileResponse = (response.json() || {}) as IResponseFileSingle;

        var file;
        if (fileResponse.file){
            file = this.mapService.mapFile(fileResponse.file);
        }

        return new ResponseFileSingle({
            file: file,
            fileFound: fileResponse.fileFound,
            action: fileResponse.action
        });
    }

    private getMultipleFileResponse(response: Response): ResponseFileMultiple {
        var filesResponse = (response.json() || {}) as IResponseFileMultiple;

        var files;
        if (filesResponse.files){
            files = this.mapService.mapFiles(filesResponse.files);
        }

        return new ResponseFileMultiple({
            action: filesResponse.action,
            files: files,
            filesCount: filesResponse.filesCount
        });
    }

    private getDeleteFileResponse(response: Response): ResponseDeleteFile {
        var responseDelete = (response.json() || {}) as IResponseDeleteFile;

        return new ResponseDeleteFile({
            action: responseDelete.action,
            fileDeleted: responseDelete.fileDeleted,
            fileName: responseDelete.fileName
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

     protected getCount<TItem extends IItem>(url: string): Observable<ResponseCount> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getCountResponse(response)
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

    protected getEditForm<TItem extends IItem>(url: string, itemId: number, disableCache?: boolean, data?: any): Observable<ResponseFormEdit<TItem>> {
        // trigger request
        this.startRequest();

        var body: any = {};
        body.id = itemId;
        body.disableCache = disableCache;
        body.data = data;

        return this.authHttp.post(url, body)
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

    protected getInsertForm(url: string, data?: any): Observable<ResponseFormInsert> {
        // trigger request
        this.startRequest();

        var body: any = {};
        body.data = data;

        return this.authHttp.post(url, body)
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
    
    protected uploadSingleFile(url: string, file: File): Observable<ResponseUploadSingle> {
        // trigger request
        this.startRequest();

        // do not set 'Content-Type', it messes up the request headers
        var headers = new Headers({ 'Accept': 'application/json' }); 
        var headerOptions = new RequestOptions({ headers: headers });

        var formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.authHttp.post(url, formData, headerOptions)
            .map(response => {
                return this.getSingleUploadResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected uploadMultipleFiles(url: string, files: File[]): Observable<ResponseUploadMultiple> {
        // trigger request
        this.startRequest();

        // do not set 'Content-Type', it messes up the request headers
        var headers = new Headers({ 'Accept': 'application/json' }); 
        var headerOptions = new RequestOptions({ headers: headers });

        var formData: FormData = new FormData();

        if (files && Array.isArray(files)){
           files.forEach(file => {
               formData.append('files', file, file.name);
           }) 
        }

        return this.authHttp.post(url, formData, headerOptions)
            .map(response => {
                return this.getMultipleUploadResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getSingleFile(url: string): Observable<ResponseFileSingle> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getSingleFileResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected getMultipleFiles(url: string): Observable<ResponseFileMultiple> {
        // trigger request
        this.startRequest();

        return this.authHttp.get(url)
            .map(response => {
                return this.getMultipleFileResponse(response)
            })
            .catch(response => {
                return Observable.throw(this.handleError(response));
            })
            ._finally(() => {
                this.finishRequest();
            });
    }

    protected deleteFile(url: string, fileUrl: string): Observable<ResponseDeleteFile> {
        // trigger request
        this.startRequest();

        var body: any = {};
        body.fileUrl = fileUrl; // fileUrl property is required by the API Server

        return this.authHttp.post(url, body)
            .map(response => {
                return this.getDeleteFileResponse(response)
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

        var mergedObservable: Observable<any> | null = null;

        observables.forEach(observable => {
            if (!mergedObservable) {
                mergedObservable = observable;
            }
            else {
                mergedObservable = mergedObservable.merge(observable);
            }
        })

        if (mergedObservable == null){
            throw Error(`Merging observables failed - there is no merged observable in disposal`);
        }

        return mergedObservable;
    }
}