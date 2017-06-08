import { ResponseGetBase } from '../models/response-get-base.class';
import { IItem } from './iitem.interface';
import { IFormValidationResult } from './iform-validation-result.interface';
import { ReasonEnum } from '../models/error-reason.enum';

export interface IErrorResponseRaw{
    error: string;
    reason: ReasonEnum;
}

export interface IFormErrorResponseRaw extends IErrorResponseRaw{
    isInvalid: boolean;
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

    isSuccess: boolean,
}

export interface IResponseEditRaw {
    item: any,
}



