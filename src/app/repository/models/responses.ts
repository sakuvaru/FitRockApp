import { ResponseGetBase } from './response-get-base.class';
import { IItem } from '../interfaces/iitem.interface';
import { IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';

export class ErrorResponse implements IErrorResponseRaw {
    constructor(
        public error: string,
    ) {
    }
}

export class FormErrorResponse implements IFormErrorResponseRaw {
    constructor(
        public error: string,
        public formValidation: IFormValidationResult
    ) {
    }
}

export class ResponseMultiple<T extends IItem> extends ResponseGetBase {

    // base properties
    public fromCache: boolean;
    public timeCreated: Date;
    public type: string;
    public action: string;

    public itemsPerPage: number;
    public page: number;
    public totalItems: number;
    public limit: number;
    public pages: number;
    public items: T[];

    constructor(
        private fields?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,

            itemsPerPage?: number,
            page?: number,
            totalItems?: number,
            limit?: number,
            pages?: number,
            items?: T[]
        }) {
        super()
        if (fields) Object.assign(this, fields);
        {
        }
    }
}

export class ResponseSingle<T extends IItem> extends ResponseGetBase {

    public fromCache: boolean;
    public timeCreated: Date;
    public type: string;
    public action: string;
    public item: T;

    constructor(
        private fields?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,

            item?: T
        }) {
        super()
        if (fields) Object.assign(this, fields);
        {
        }
    }
}

export class ResponseCreate<T extends IItem> {

    public item: T;

    constructor(
        private fields?: {
            item?: T;
            result?: number;
        }) {
        if (fields) Object.assign(this, fields);
        {
        }
    }
}

export class ResponseDelete {

    constructor(
        private fields?: {
        }) {
        if (fields) Object.assign(this, fields);
        {
        }
    }
}

export class ResponseEdit<T extends IItem> {

    public item: T;

    constructor(
        private fields?: {
            item?: T,
        }) {
        if (fields) Object.assign(this, fields);
        {
        }
    }
}



