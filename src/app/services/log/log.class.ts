import { IItem } from '../../repository/iitem.class';

export class Log implements IItem {
    constructor(
        public id: number,
        public codename: string,
        public guid: string,
        public created: Date,
        public updated: Date,
        public user: string,
        public stacktrace: string,
        public errorMessage: string
    ) { }
}