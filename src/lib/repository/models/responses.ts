import { ResponseGetBase } from './response-get-base.class';
import { IItem } from '../interfaces/iitem.interface';
import { IErrorResponseRaw, IFormErrorResponseRaw } from '../interfaces/iraw-responses';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';
import { ErrorReasonEnum } from './error-reason.enum';
import { FormField } from './form-fields';

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

export class ResponseMultiple<T> extends ResponseGetBase {

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
            model?: string,

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

    isEmpty(): boolean {
        return !this.items || this.items.length <= 0;
    }

    firstItem(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }
}


export class ResponseCount {

    public count: number;

    constructor(
        private options?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,
            model?: string,

            count?: number
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseSingle<T> extends ResponseGetBase {

    public item: T;

    constructor(
        private options?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,
            model?: string,

            item?: T
        }) {
        super()
        if (options) Object.assign(this, options);
    }

    isEmpty(): boolean {
        return !this.item;
    }
}

export class ResponseCreate<T extends IItem> {

    public item: T;
    public model: string;

    constructor(
        private options?: {
            item?: T;
            result?: number;
            model?: string,
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
    public model: string;

    constructor(
        private options?: {
            item?: T,
            model?: string,
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseFormInsert {

    public type: string;
    public formType: string;
    public fields: FormField[];
    public model: string;

    constructor(
        private options?: {
            type?: string,
            formType?: string,
            fields?: FormField[],
            model?: string,

        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseFormEdit<T extends IItem>  {

    public type: string;
    public formType: string;
    public fields: FormField[];
    public timeCreated: Date;
    public fromCache: boolean;
    public item: T;
    public model: string;

    constructor(
        private options?: {
            type?: string,
            formType?: string,
            fields?: FormField[],
            timeCreated: Date;
            fromCache: boolean;
            item: T;
            model?: string,
        }) {
        if (options) Object.assign(this, options);
    }
}

export class ResponsePost<T extends any>{
    public data: T;
    public action: string;
    public message: string;
    public model: string;

    constructor(
        private options?: {
            data?: T,
            action?: string;
            message?: string;
            model?: string,
        }
    ) {
        if (options) Object.assign(this, options);
    }
}

export class ResponseUploadMultiple<T> {

    public files: T[];

    constructor(
        private options?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,
            model?: string,

            files?: T[]
        }) {
        if (options) Object.assign(this, options);
    }

    isEmpty(): boolean {
        return !this.files || this.files.length <= 0;
    }

    firstItem(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.files[0];
    }
}

export class ResponseUploadSingle<T> {

    public file: T;

    constructor(
        private options?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,
            model?: string,

            file?: T
        }) {
        if (options) Object.assign(this, options);
    }
}



