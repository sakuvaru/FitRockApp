import { ResponseGetBase } from './response-get-base.class';
import { IItem } from './iitem.interface';

export class ResponseMultiple<T extends IItem> extends ResponseGetBase {

    // base properties
    public fromCache: boolean;
    public timeCreated: Date;
    public type: string;
    public action: string;
    public result: number;

    public itemsPerPage: number;
    public page: number;
    public totalItems: number;
    public limit: number;
    public pages: number;
    public items: T[];

    constructor(
        public fields?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,
            result?: number,

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
    public result: number;
    public item: T;

    constructor(
        public fields?: {
            fromCache?: boolean,
            timeCreated?: Date,
            type?: string,
            action?: string,
            result?: number,

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
    public result: number;

    constructor(
        public fields?: {
            item?: T;
            result?: number;
        }) {
        if (fields) Object.assign(this, fields);
        {
        }
    }
}

export class ResponseDelete {

    public result: number;

    constructor(
        public fields?: {
            result?: number;
        }) {
        if (fields) Object.assign(this, fields);
        {
        }
    }

    isSuccess(): boolean {
        return this.result === 200;
    }
}

export class ResponseEdit<T extends IItem> {

    public item: T;
    public result: number;

    constructor(
        public fields?: {
            item?: T,
            result?: number,
        }) {
        if (fields) Object.assign(this, fields);
        {
        }
    }
}



