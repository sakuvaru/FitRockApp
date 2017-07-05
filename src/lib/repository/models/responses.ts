import { ResponseGetBase } from './response-get-base.class';
import { IItem } from '../interfaces/iitem.interface';
import { IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';
import { ErrorReasonEnum } from './error-reason.enum';
import { BaseField } from './form-fields';

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
    if (reasonCode === 5) {
        return ErrorReasonEnum.RepositoryException;
    };

    if (reasonCode === 404) {
        return ErrorReasonEnum.NotFound;
    }

    return ErrorReasonEnum.Other;
}

export class ErrorResponse implements IErrorResponseRaw {

    public reason: ErrorReasonEnum;

    constructor(
        public error: string,
        public reasonCode: number,
        public internalError?: any
    ) {
        this.reason = mapReason(reasonCode);
    }
}

export class FormErrorResponse implements IFormErrorResponseRaw {

    public reason: ErrorReasonEnum;

    constructor(
        public error: string,
        public reasonCode: number,
        public formValidation: IFormValidationResult,
        public internalError?: any
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
        private options?: {
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
        if (options) Object.assign(this, options);
    }

    isEmpty(): boolean{
        return !this.items || this.items.length <= 0;
    }

    firstItem(): T{
        if (this.isEmpty()){
            return null;
        }
        return this.items[0];
    }
}

export class ResponseSingle<T extends IItem> extends ResponseGetBase {

    public fromCache: boolean;
    public timeCreated: Date;
    public type: string;
    public action: string;
    public item: T;

    constructor(
        private options?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,

            item?: T
        }) {
        super()
        if (options) Object.assign(this, options);
    }

     isEmpty(): boolean{
        return !this.item;
    }
}

export class ResponseCreate<T extends IItem> {

    public item: T;

    constructor(
        private options?: {
            item?: T;
            result?: number;
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseDelete {

    public action: string;
    public deletedItemId: number;

    constructor(
        private options?: {
            deletedItemId: number,
            action: string
        }
    ) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseEdit<T extends IItem> {

    public item: T;

    constructor(
        private options?: {
            item?: T,
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseFormInsert {

    public type: string;
    public formType: string;
    public fields: BaseField<any>[];

    constructor(
        private options?: {
            type?: string,
            formType?: string,
            fields?: BaseField<any>[],
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseFormEdit<T extends IItem>  {

    public type: string;
    public formType: string;
    public fields: BaseField<any>[];
    public timeCreated: Date;
    public fromCache: boolean;
    public item: T;

    constructor(
        private options?: {
            type?: string,
            formType?: string,
            fields?: BaseField<any>[],
            timeCreated: Date;
            fromCache: boolean;
            item: T;
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponsePost<T extends any>{
    public data: T;
    public action: string;
    public message: string;

    constructor(
        private options?: {
            data?: T,
            action?: string;
            message?: string;
        }
    ) { }
}



