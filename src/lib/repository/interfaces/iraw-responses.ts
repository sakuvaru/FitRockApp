import { ResponseGetBase } from '../models/response-get-base.class';
import { IItem } from './iitem.interface';
import { IFormValidationResult } from './iform-validation-result.interface';
import { ErrorReasonEnum } from '../enums/error-reason.enum';
import { FormField } from '../models/form-fields';
import { IFetchedFile } from '../interfaces/ifetched-file.interface';

export interface IResponseBase {
    action: string;
}

export interface IItemResponseBase extends IResponseBase {
    model: string;
    fromCache: boolean;
    timeCreated: Date;
    type: string;
}

export interface IErrorResponseRaw {
    error: string;
    reason: ErrorReasonEnum;
}

export interface IFormErrorResponseRaw extends IErrorResponseRaw {
    formValidation: IFormValidationResult;
}

export interface IAuthErrorResponseRaw extends IErrorResponseRaw {
    authError: number;
}

export interface IResponseMultipleRaw extends IItemResponseBase {
    itemsPerPage: number;
    page: number;
    totalItems: number;
    limit: number;
    pages: number;
    items: any[];
}

export interface IResponseCountRaw extends IResponseBase {
    count: number;
    fromCache: boolean;
    timeCreated: Date;
    model: string;
    type: string;
}

export interface IResponseSingleRaw extends IItemResponseBase {
    item: any;
}

export interface IResponseCreateRaw extends IResponseBase {
    model: string;
    item: IItem;
}

export interface IResponseDeleteRaw extends IResponseBase {
    action: string;
    deletedItemId: number;
}

export interface IResponseEditRaw extends IResponseBase {
    item: IItem;
    timeCreated: Date;
    fromCache: boolean;
    model: string;
}

export interface IResponseFormInsertRaw extends IResponseBase {
    formType: string;
    fields: FormField[];
    model: string;
    type: string;
}

export interface IResponseFormEditRaw extends IResponseBase {
    formType: string;
    fields: FormField[];
    timeCreated: Date;
    fromCache: boolean;
    item: IItem;
    model: string;
    type: string;
}

export interface IResponsePostRaw extends IResponseBase {
    data: any;
    message: string;
    model: string;
}

export interface IResponseUploadMultipleRaw extends IResponseBase {
    files: IFetchedFile[];
}
export interface IResponseUploadSingleRaw extends IResponseBase {
    file: IFetchedFile;
}
export interface IResponseFileSingle extends IResponseBase {
    file?: IFetchedFile;
    fileFound: boolean;
}

export interface IResponseFileMultiple extends IResponseBase {
    files?: IFetchedFile[];
    filesCount: number;
}

export interface IResponseDeleteFile extends IResponseBase {
    fileName: string;
    fileDeleted: boolean;
}

export interface IResponseUpdateItemsOrder {
    orderedItems: IItem[];
    model: string;
    type: string;
    action: string;
}






