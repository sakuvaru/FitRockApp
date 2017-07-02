import { ResponseGetBase } from '../models/response-get-base.class';
import { IItem } from './iitem.interface';
import { IFormValidationResult } from './iform-validation-result.interface';
import { ErrorReasonEnum } from '../models/error-reason.enum';
import { BaseField } from '../models/form-fields';

export interface IErrorResponseRaw {
    error: string;
    reason: ErrorReasonEnum;
}

export interface IFormErrorResponseRaw extends IErrorResponseRaw {
    formValidation: IFormValidationResult;
}

export interface IResponseMultipleRaw {

    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,

    itemsPerPage: number,
    page: number,
    totalItems: number,
    limit: number,
    pages: number,
    items: any
}


export interface IResponseSingleRaw {
    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,

    item: any
}

export interface IResponseCreateRaw {
    item: any,
}

export interface IResponseDeleteRaw {
    action: string;
    deletedItemId: number;
}

export interface IResponseEditRaw {
    item: any,
}

export interface IResponseFormInsertRaw {
    type: string,
    formType: string,
    fields: BaseField<any>[],
}

export interface IResponseFormEditRaw {
    type: string,
    formType: string,
    fields: BaseField<any>[],
    timeCreated: Date,
    fromCache: boolean,
    item: any
}

export interface IResponsePostRaw {
    data: any;
    action: string;
    message: string;
}





