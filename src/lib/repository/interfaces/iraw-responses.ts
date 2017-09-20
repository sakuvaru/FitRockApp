import { ResponseGetBase } from '../models/response-get-base.class';
import { IItem } from './iitem.interface';
import { IFormValidationResult } from './iform-validation-result.interface';
import { ErrorReasonEnum } from '../models/error-reason.enum';
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

export interface IResponseMultipleRaw extends IItemResponseBase {
    itemsPerPage: number;
    page: number;
    totalItems: number;
    limit: number;
    pages: number;
    items: any;
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
    item: any;
}

export interface IResponseDeleteRaw extends IResponseBase {
    action: string;
    deletedItemId: number;
}

export interface IResponseEditRaw extends IResponseBase {
    item: any;
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
    item: any;
    model: string;
    type: string
}

export interface IResponsePostRaw extends IResponseBase {
    data: any;
    message: string;
    model: string;
}

export interface IResponseUploadMultipleRaw<T> extends IItemResponseBase {
    files: T[];
    type: string;
}
export interface IResponseUploadSingleRaw<T> extends IItemResponseBase {
    file: T;
}


export interface IResponseFileSingle extends IResponseBase {
    file?: IFetchedFile;
    fileFound: boolean;
}

export interface IResponseFileMultiple extends IResponseBase {
    files?: IFetchedFile[];
    filesCount: number;
}




