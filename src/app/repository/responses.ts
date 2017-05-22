import { ResponseGetBase } from './response-get-base.class';
import { IItem } from './iitem.class';

export class ResponseMultiple<T extends IItem> extends ResponseGetBase {

    constructor(
        // base properties
        fromCache: boolean,
        timeCreated: Date,
        type: string,
        action: string,
        result: number,

        // multiple response specific properties
        public itemstPerPage: number,
        public page: number,
        public totalItems: number,
        public limit: number,
        public pages: number,
        public items: T[]
    ) {
        super(
            fromCache,
            timeCreated,
            type,
            action,
            result
        )
    }
}

export class ResponseSingle<T extends IItem> extends ResponseGetBase {
    constructor(
        fromCache: boolean,
        timeCreated: Date,
        type: string,
        action: string,
        result: number,
        public item: T
    ) {
        super(
            fromCache,
            timeCreated,
            type,
            action,
            result
        )
    }
}

export class ResponseCreate<T extends IItem> {
    constructor(
        public item: T,
        public result: number
    ) {
    }
}

export class ResponseDelete {

    public isSuccess: boolean = false;

    constructor(
        public result: number
    ) {
        if (this.result === 200) {
            this.isSuccess = true;
        }
    }
}

export class ResponseEdit<T extends IItem> {
    constructor(
        public item: T,
        public result: number
    ) {
    }
}



