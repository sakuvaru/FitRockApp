import { BaseItem } from '../../lib/repository.lib';

export class Log extends BaseItem {

    public user: string;
    public stacktrace: string;
    public errorMessage: string;

    constructor(
        public fields?: {
            id?: number,
            codename?: string,
            guid?: string,
            created?: Date,
            updated?: Date,
            
            user?: string,
            stacktrace?: string,
            errorMessage?: string,
        }) {
            super()
        if (fields) Object.assign(this, fields);
    }
}