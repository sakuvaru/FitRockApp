import { IItem } from '../repository/iitem.class';
import { BaseField } from '../core/web-components/dynamic-form/base-field.class';

export class Log implements IItem {

    public codename: string;
    public guid: string;
    public created: Date;
    public updated: Date;
    public id: number;
    public user: string;
    public stacktrace: string;
    public errorMessage: string;

    constructor(
        public fields?: {
            user?: string,
            stacktrace?: string,
            errorMessage?: string,
            id?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}