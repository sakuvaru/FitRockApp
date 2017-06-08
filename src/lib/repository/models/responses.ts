import { ResponseGetBase } from './response-get-base.class';
import { IItem } from '../interfaces/iitem.interface';
import { IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';
import { ErrorReasonEnum } from './error-reason.enum';

export function mapReason(reasonCode: number): ErrorReasonEnum {
    if (reasonCode === 0) {
        return ErrorReasonEnum.Other;
    };
    if (reasonCode === 1) {
        return ErrorReasonEnum.FormError;
    };
    if (reasonCode === 2) {
        return ErrorReasonEnum.LicenseLimitation;
    };

    if (reasonCode === 3) {
        return ErrorReasonEnum.NotAuthorized;
    };
    if (reasonCode === 4) {
        return ErrorReasonEnum.CoreException;
    };

    if (reasonCode === 404){
        return ErrorReasonEnum.NotFound;
    }

    return ErrorReasonEnum.Other;
}

export class ErrorResponse implements IErrorResponseRaw {

    public reason: ErrorReasonEnum;

    constructor(
        public error: string,
        public reasonCode: number
    ) {
        this.reason = mapReason(reasonCode);
    }
}

export class FormErrorResponse implements IFormErrorResponseRaw {

    public reason: ErrorReasonEnum;

    constructor(
        public error: string,
        public reasonCode: number,
        public isInvalid: boolean,
        public formValidation: IFormValidationResult
    ) {
        this.reason = mapReason(reasonCode);
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
    }
}

export class ResponseDelete {

    constructor(
        private fields?: {
        }) {
        if (fields) Object.assign(this, fields);
    }
}

export class ResponseEdit<T extends IItem> {

    public item: T;

    constructor(
        private fields?: {
            item?: T,
        }) {
        if (fields) Object.assign(this, fields);
    }
}



