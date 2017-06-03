import { ResponseGetBase } from './response-get-base.class';
import { IItem } from './iitem.interface';

export interface IResponseMultipleRaw {

    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    result: number,

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
    result: number,

    item: any
}

export interface IResponseCreateRaw {
    item: any,
    result: number
}

export interface IResponseDeleteRaw {

    isSuccess: boolean,
    result: number
}

export interface IResponseEditRaw {
    item: any,
    result: number
}



