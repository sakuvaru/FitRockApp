import { IItem } from '../../repository/iitem.class';

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
        fields?: {
            user?: string,
            stacktrace?: string,
            errorMessage?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}