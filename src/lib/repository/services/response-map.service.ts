// core models
import { Headers, RequestOptions } from '@angular/http';
import { IOption } from '../interfaces/ioption.interface';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { IItem } from '../interfaces/iitem.interface';
import { RepositoryConfig } from '../repository.config';

// responses
import { ResponseDeleteFile, ResponseFileMultiple, ResponseFileSingle, ResponseUploadMultiple, 
    ResponseUploadSingle, ResponseCount, ResponsePost, ResponseFormEdit, ResponseFormInsert, 
    ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle,
    ErrorResponse, FormErrorResponse, ResponseUpdateItemsOrder
    } from '../models/responses';

// raw responses
import { IResponseDeleteFile, IResponseFileMultiple, IResponseFileSingle, IResponseUploadMultipleRaw, 
    IResponseUploadSingleRaw, IResponseCountRaw, IResponsePostRaw, IResponseFormEditRaw, 
    IResponseFormInsertRaw, IResponseCreateRaw, IResponseDeleteRaw, IResponseEditRaw, IResponseMultipleRaw,
    IResponseSingleRaw, IErrorResponseRaw, IFormErrorResponseRaw, IResponseUpdateItemsOrder 
    } from '../interfaces/iraw-responses';

// services
import { MapService } from './map.service';
import { TypeResolverService } from './type-resolver.service';

export class ResponseMapService {

    // services
    private mapService: MapService;

    constructor(
        protected config: RepositoryConfig
    ) {
        this.mapService = new MapService(new TypeResolverService(config.typeResolvers));
    }

    mapMultipleResponseCustom<TModel>(response: Response): ResponseMultiple<TModel> {
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

     mapMultipleResponse<TItem extends IItem>(response: Response): ResponseMultiple<TItem> {
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

     mapSingleResponseCustom<TModel>(response: Response): ResponseSingle<TModel> {
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

     mapCountResponse<TItem extends IItem>(response: Response): ResponseCount {
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

     mapSingleResponse<TItem extends IItem>(response: Response): ResponseSingle<TItem> {
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

     mapCreateResponse<TItem extends IItem>(response: Response): ResponseCreate<TItem> {
        var responseCreate = (response.json() || {}) as IResponseCreateRaw;

        var item = this.mapService.mapItem<TItem>(responseCreate.item);

        return new ResponseCreate<TItem>({
            item: item,
            model: responseCreate.model
        });
    }

     mapEditResponse<TItem extends IItem>(response: Response): ResponseEdit<TItem> {
        var responseEdit = (response.json() || {}) as IResponseEditRaw;

        var item = this.mapService.mapItem<TItem>(responseEdit.item);

        return new ResponseEdit<TItem>({
            item: item,
            model: responseEdit.model
        });
    }

    mapUpdateItemsOrderResponse<TItem extends IItem>(response: Response): ResponseUpdateItemsOrder<TItem> {
        var responseUpdateItemsOrder = (response.json() || {}) as IResponseUpdateItemsOrder;

        var items = this.mapService.mapItems<TItem>(responseUpdateItemsOrder.orderedItems);

        return new ResponseUpdateItemsOrder<TItem>({
            orderedItems: items,
            type: responseUpdateItemsOrder.type,
            action: responseUpdateItemsOrder.action,
            model: responseUpdateItemsOrder.model
        });
    }

     mapPostResponse<T extends any>(response: Response): ResponsePost<T> {
        var responsePost = (response.json() || {}) as IResponsePostRaw;

        return new ResponsePost<T>({
            data: responsePost.data as T,
            action: responsePost.action,
            message: responsePost.message,
            model: responsePost.model
        });
    }

     mapDeleteResponse(response: Response): ResponseDelete {
        var responseDelete = (response.json() || {}) as IResponseDeleteRaw;

        return new ResponseDelete({
            action: responseDelete.action,
            deletedItemId: responseDelete.deletedItemId,
        });
    }

     mapFormEditResponse<TItem extends IItem>(response: Response): ResponseFormEdit<TItem> {
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

     mapFormInsertResponse(response: Response): ResponseFormInsert {
        var responseForm = (response.json() || {}) as IResponseFormInsertRaw;

        var formFields = this.mapService.mapFormFields(responseForm.fields);

        return new ResponseFormInsert({
            fields: formFields,
            formType: responseForm.formType,
            type: responseForm.type,
            model: responseForm.model
        });
    }

     mapSingleUploadResponse(response: Response): ResponseUploadSingle {
        var responseUpload = (response.json() || {}) as IResponseUploadSingleRaw;

        var file = this.mapService.mapFile(responseUpload.file);

        return new ResponseUploadSingle({
            file: file,
            action: responseUpload.action,
        });
    }

     mapMultipleUploadResponse(response: Response): ResponseUploadMultiple {
        var responseUpload = (response.json() || {}) as IResponseUploadMultipleRaw;

        var files = this.mapService.mapFiles(responseUpload.files);

        return new ResponseUploadMultiple({
            files: files,
            action: responseUpload.action,
        });
    }

     mapSingleFileResponse(response: Response): ResponseFileSingle {
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

     mapMultipleFileResponse(response: Response): ResponseFileMultiple {
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

     mapDeleteFileResponse(response: Response): ResponseDeleteFile {
        var responseDelete = (response.json() || {}) as IResponseDeleteFile;

        return new ResponseDeleteFile({
            action: responseDelete.action,
            fileDeleted: responseDelete.fileDeleted,
            fileName: responseDelete.fileName
        });
    }
}