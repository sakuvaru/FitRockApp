import { ResponseGetBase } from '../models/response-get-base.class';
import { IItem } from './iitem.interface';
import { IFormValidationResult } from './iform-validation-result.interface';
import { ErrorReasonEnum } from '../models/error-reason.enum';
import { FormField } from '../models/form-fields';

export interface IResponseBase {
    type: string;
    model: string;
    action: string;
}

export interface IErrorResponseRaw {
    error: string;
    reason: ErrorReasonEnum;
}

export interface IFormErrorResponseRaw extends IErrorResponseRaw {
    formValidation: IFormValidationResult;
}

export interface IResponseMultipleRaw extends IResponseBase {
    fromCache: boolean,
    timeCreated: Date,
    itemsPerPage: number,
    page: number,
    totalItems: number,
    limit: number,
    pages: number,
    items: any
}

export interface IResponseCountRaw extends IResponseBase {

    count: number;
    fromCache: boolean,
    timeCreated: Date,
}

export interface IResponseSingleRaw extends IResponseBase {
    fromCache: boolean,
    timeCreated: Date,
    action: string,

    item: any
}

export interface IResponseCreateRaw extends IResponseBase {
    item: any,
}

export interface IResponseDeleteRaw extends IResponseBase {
    action: string;
    deletedItemId: number;
}

export interface IResponseEditRaw extends IResponseBase {
    item: any,
    timeCreated: Date,
    fromCache: boolean,
}

export interface IResponseFormInsertRaw extends IResponseBase {
    formType: string,
    fields: FormField[],
}

export interface IResponseFormEditRaw extends IResponseBase {
    formType: string,
    fields: FormField[],
    timeCreated: Date,
    fromCache: boolean,
    item: any
}

export interface IResponsePostRaw extends IResponseBase {
    data: any;
    message: string;
}

export interface IResponseUploadMultipleRaw<T> {

    files: T[];

    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    model: string,
}
export interface IResponseUploadSingleRaw<T> {

    file: T;
    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    model: string,

}




